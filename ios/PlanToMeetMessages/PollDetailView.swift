import Combine
import SwiftUI

// MARK: - View Model

final class PollDetailViewModel: ObservableObject {
    @Published var poll: SupabaseAPI.PollRow?
    @Published var timeSlots: [SupabaseAPI.TimeSlotRow] = []
    @Published var responses: [SupabaseAPI.ResponseRow] = []
    @Published var participants: [SupabaseAPI.ParticipantRow] = []
    @Published var isLoading = true
    @Published var errorMessage: String?
    @Published var myResponses: [String: String] = [:]  // slotId -> availability
    @Published var isSubmitting = false
    @Published var hasSubmitted = false

    let pollId: String
    private static let sessionIdKey = "PlanToMeet_SessionId"

    var sessionId: String {
        if let existing = UserDefaults.standard.string(forKey: Self.sessionIdKey) {
            return existing
        }
        let newId = UUID().uuidString.lowercased()
        UserDefaults.standard.set(newId, forKey: Self.sessionIdKey)
        return newId
    }

    var slotsByDate: [(date: String, slots: [SupabaseAPI.TimeSlotRow])] {
        let grouped = Dictionary(grouping: timeSlots) { $0.day }
        return grouped.sorted { $0.key < $1.key }.map { (date: $0.key, slots: $0.value) }
    }

    var participantCount: Int {
        participants.count
    }

    init(pollId: String) {
        self.pollId = pollId
    }

    func loadPoll() {
        isLoading = true
        errorMessage = nil

        Task { @MainActor in
            do {
                async let pollFetch = SupabaseAPI.fetchPoll(id: pollId)
                async let slotsFetch = SupabaseAPI.fetchTimeSlots(pollId: pollId)
                async let responsesFetch = SupabaseAPI.fetchResponses(pollId: pollId)
                async let participantsFetch = SupabaseAPI.fetchParticipants(pollId: pollId)

                let (fetchedPoll, fetchedSlots, fetchedResponses, fetchedParticipants) =
                    try await (pollFetch, slotsFetch, responsesFetch, participantsFetch)

                poll = fetchedPoll
                timeSlots = fetchedSlots
                responses = fetchedResponses
                participants = fetchedParticipants

                // Load existing responses for this session
                let myExisting = fetchedResponses.filter { $0.sessionId == sessionId }
                for resp in myExisting {
                    myResponses[resp.slotId] = resp.availability
                }
                hasSubmitted = !myExisting.isEmpty

            } catch {
                errorMessage = error.localizedDescription
            }

            isLoading = false
        }
    }

    func toggleResponse(slotId: String) {
        let current = myResponses[slotId]
        switch current {
        case nil, "unavailable":
            myResponses[slotId] = "available"
        case "available":
            myResponses[slotId] = "maybe"
        case "maybe":
            myResponses[slotId] = "unavailable"
        default:
            myResponses[slotId] = "available"
        }
    }

    func submitResponses() {
        guard !isSubmitting else { return }
        isSubmitting = true
        errorMessage = nil

        let sid = sessionId
        let pid = pollId
        let responsesToSubmit = myResponses

        Task { @MainActor in
            do {
                // Insert participant if not exists
                if !participants.contains(where: { $0.sessionId == sid }) {
                    try await SupabaseAPI.insertParticipant(pollId: pid, sessionId: sid, displayName: "iMessage User")
                }

                // Submit each response
                for (slotId, availability) in responsesToSubmit {
                    try await SupabaseAPI.submitResponse(
                        pollId: pid,
                        slotId: slotId,
                        sessionId: sid,
                        availability: availability
                    )
                }

                hasSubmitted = true
                // Reload data silently without showing loading spinner
                reloadDataSilently()
            } catch {
                errorMessage = error.localizedDescription
            }

            isSubmitting = false
        }
    }

    private func reloadDataSilently() {
        Task { @MainActor in
            do {
                async let responsesFetch = SupabaseAPI.fetchResponses(pollId: pollId)
                async let participantsFetch = SupabaseAPI.fetchParticipants(pollId: pollId)

                let (fetchedResponses, fetchedParticipants) =
                    try await (responsesFetch, participantsFetch)

                responses = fetchedResponses
                participants = fetchedParticipants
            } catch {
                // Silently fail - data is already showing
            }
        }
    }

    func responseCountForSlot(_ slotId: String) -> Int {
        responses.filter { $0.slotId == slotId && $0.availability == "available" }.count
    }
}

// MARK: - View

struct PollDetailView: View {
    @ObservedObject var viewModel: PollDetailViewModel
    var onDismiss: (() -> Void)?

    private let bgColor = Color(red: 0.035, green: 0.035, blue: 0.043)
    private let cardColor = Color(red: 0.063, green: 0.063, blue: 0.075)
    private let borderColor = Color(red: 0.15, green: 0.15, blue: 0.17)
    private let labelColor = Color(red: 0.63, green: 0.63, blue: 0.67)
    private let accentBlue = Color(red: 0.23, green: 0.51, blue: 0.96)
    private let dimText = Color(red: 0.4, green: 0.4, blue: 0.45)

    var body: some View {
        VStack(spacing: 0) {
            if viewModel.isLoading {
                loadingView
            } else if let error = viewModel.errorMessage, viewModel.poll == nil {
                errorView(error)
            } else if let poll = viewModel.poll {
                pollContent(poll)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(bgColor.ignoresSafeArea())
        .onAppear { viewModel.loadPoll() }
    }

    // MARK: - Loading

    private var loadingView: some View {
        VStack(spacing: 16) {
            Spacer()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: accentBlue))
                .scaleEffect(1.2)
            Text("Loading poll...")
                .font(.subheadline)
                .foregroundColor(labelColor)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Error

    private func errorView(_ error: String) -> some View {
        VStack(spacing: 16) {
            Spacer()
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 40))
                .foregroundColor(.orange)
            Text("Couldn't load poll")
                .font(.headline)
                .foregroundColor(.white)
            Text(error)
                .font(.caption)
                .foregroundColor(labelColor)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            Button("Try Again") {
                viewModel.loadPoll()
            }
            .font(.subheadline.weight(.semibold))
            .foregroundColor(.white)
            .padding(.horizontal, 24)
            .padding(.vertical, 10)
            .background(accentBlue)
            .cornerRadius(10)

            if onDismiss != nil {
                Button("Done") {
                    onDismiss?()
                }
                .font(.subheadline)
                .foregroundColor(labelColor)
                .padding(.top, 4)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Poll Content

    private func pollContent(_ poll: SupabaseAPI.PollRow) -> some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 10) {
                Image(systemName: "calendar.badge.clock")
                    .font(.title3)
                    .foregroundColor(accentBlue)
                VStack(alignment: .leading, spacing: 2) {
                    Text(poll.title.isEmpty ? "PlanToMeet Poll" : poll.title)
                        .font(.headline)
                        .foregroundColor(.white)
                    Text("\(viewModel.participantCount) \(viewModel.participantCount == 1 ? "participant" : "participants") \u{00B7} \(viewModel.timeSlots.count) time slots")
                        .font(.caption)
                        .foregroundColor(labelColor)
                }
                Spacer()

                if let onDismiss {
                    Button {
                        onDismiss()
                    } label: {
                        Text("Done")
                            .font(.subheadline.weight(.semibold))
                            .foregroundColor(accentBlue)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)

            if viewModel.hasSubmitted {
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("You've responded to this poll")
                        .font(.caption)
                        .foregroundColor(.green)
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
            }

            Divider().background(borderColor)

            // Instruction
            Text(viewModel.hasSubmitted ? "Tap a slot to change your response" : "Tap to cycle: Yes \u{2192} Maybe \u{2192} No")
                .font(.caption)
                .foregroundColor(dimText)
                .padding(.vertical, 8)

            // Slots
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 16) {
                    ForEach(viewModel.slotsByDate, id: \.date) { group in
                        VStack(alignment: .leading, spacing: 6) {
                            Text(formatDateHeader(group.date))
                                .font(.caption.weight(.semibold))
                                .foregroundColor(labelColor)
                                .textCase(.uppercase)
                                .padding(.horizontal, 4)

                            ForEach(group.slots, id: \.id) { slot in
                                slotRow(slot)
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 100)
            }

            // Error banner
            if let error = viewModel.errorMessage, viewModel.poll != nil {
                HStack(spacing: 6) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.white)
                        .font(.caption)
                    Text(error)
                        .font(.caption)
                        .foregroundColor(.white)
                        .lineLimit(2)
                    Spacer()
                    Button {
                        viewModel.errorMessage = nil
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.white.opacity(0.7))
                    }
                    .buttonStyle(.plain)
                }
                .padding(10)
                .frame(maxWidth: .infinity)
                .background(Color.red.opacity(0.85))
                .cornerRadius(10)
                .padding(.horizontal, 16)
                .padding(.bottom, 4)
            }

            // Submit / Update button
            Button(action: { viewModel.submitResponses() }) {
                HStack(spacing: 8) {
                    if viewModel.isSubmitting {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                    } else {
                        Image(systemName: viewModel.hasSubmitted ? "arrow.triangle.2.circlepath" : "paperplane.fill")
                            .font(.subheadline)
                    }
                    Text(viewModel.isSubmitting
                        ? "Submitting..."
                        : (viewModel.hasSubmitted ? "Update Response" : "Submit Response"))
                        .font(.body.weight(.semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(viewModel.myResponses.isEmpty ? Color(red: 0.15, green: 0.15, blue: 0.18) : accentBlue)
                .cornerRadius(14)
            }
            .disabled(viewModel.isSubmitting || viewModel.myResponses.isEmpty)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(bgColor)
        }
    }

    // MARK: - Slot Row

    private func slotRow(_ slot: SupabaseAPI.TimeSlotRow) -> some View {
        let myResponse = viewModel.myResponses[slot.id]
        let yesCount = viewModel.responseCountForSlot(slot.id)

        return Button {
            viewModel.toggleResponse(slotId: slot.id)
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(formatTime(slot.startTime)) - \(formatTime(slot.endTime))")
                        .font(.subheadline.weight(.medium))
                        .foregroundColor(.white)
                    if yesCount > 0 {
                        Text("\(yesCount) available")
                            .font(.caption)
                            .foregroundColor(dimText)
                    }
                }

                Spacer()

                responseIndicator(myResponse)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(backgroundForResponse(myResponse))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(borderForResponse(myResponse), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }

    private func responseIndicator(_ response: String?) -> some View {
        Group {
            switch response {
            case "available":
                HStack(spacing: 4) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Yes")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.green)
                }
            case "maybe":
                HStack(spacing: 4) {
                    Image(systemName: "questionmark.circle.fill")
                        .foregroundColor(.orange)
                    Text("Maybe")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.orange)
                }
            case "unavailable":
                HStack(spacing: 4) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(dimText)
                    Text("No")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(dimText)
                }
            default:
                Text("Tap to vote")
                    .font(.caption)
                    .foregroundColor(dimText)
            }
        }
    }

    private func backgroundForResponse(_ response: String?) -> Color {
        switch response {
        case "available":
            return Color.green.opacity(0.08)
        case "maybe":
            return Color.orange.opacity(0.08)
        default:
            return cardColor
        }
    }

    private func borderForResponse(_ response: String?) -> Color {
        switch response {
        case "available":
            return Color.green.opacity(0.25)
        case "maybe":
            return Color.orange.opacity(0.25)
        default:
            return borderColor
        }
    }

    // MARK: - Formatting

    private func formatDateHeader(_ dateStr: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        guard let date = formatter.date(from: dateStr) else { return dateStr }
        let display = DateFormatter()
        display.dateFormat = "EEEE, MMM d"
        return display.string(from: date)
    }

    private func formatTime(_ timeStr: String) -> String {
        let parts = timeStr.split(separator: ":")
        guard parts.count >= 2,
              let hour = Int(parts[0]),
              let minute = Int(parts[1]) else { return timeStr }
        let period = hour >= 12 ? "PM" : "AM"
        let h = hour == 0 ? 12 : (hour > 12 ? hour - 12 : hour)
        return minute == 0 ? "\(h) \(period)" : "\(h):\(String(format: "%02d", minute)) \(period)"
    }
}
