import Messages
import SwiftUI

final class MessagesViewController: MSMessagesAppViewController {
    private var hostingController: UIHostingController<AnyView>?

    // MARK: - Lifecycle

    override func willBecomeActive(with conversation: MSConversation) {
        super.willBecomeActive(with: conversation)
        presentView(for: conversation)
    }

    override func didSelect(_ message: MSMessage, conversation: MSConversation) {
        super.didSelect(message, conversation: conversation)
        presentView(for: conversation)
    }

    // MARK: - Routing

    private func presentView(for conversation: MSConversation) {
        if let selectedURL = conversation.selectedMessage?.url,
           let pollId = MessageURLValidator.extractPollId(from: selectedURL) {
            showPollDetail(pollId: pollId)
        } else {
            showPollForm()
        }
    }

    // MARK: - UI Setup

    private func showPollForm() {
        let vm = PollFormViewModel()

        let formView = PollFormView(viewModel: vm) { [weak self] url, pollInfo in
            self?.sendMessage(url: url, pollInfo: pollInfo)
        }

        presentHostedView(AnyView(formView))
    }

    private func showPollDetail(pollId: String) {
        let vm = PollDetailViewModel(pollId: pollId)
        let detailView = PollDetailView(viewModel: vm) { [weak self] in
            guard let self else { return }
            self.requestPresentationStyle(.compact)
            self.showPollForm()
        }
        presentHostedView(AnyView(detailView))
    }

    private func presentHostedView(_ rootView: AnyView) {
        if let hostingController {
            hostingController.rootView = rootView
            return
        }

        let controller = UIHostingController(rootView: rootView)
        controller.view.translatesAutoresizingMaskIntoConstraints = false
        addChild(controller)
        view.addSubview(controller.view)

        NSLayoutConstraint.activate([
            controller.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            controller.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            controller.view.topAnchor.constraint(equalTo: view.topAnchor),
            controller.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        controller.didMove(toParent: self)
        hostingController = controller
    }

    // MARK: - Message Sending

    private func sendMessage(url: URL, pollInfo: PollMessageInfo?) {
        guard let conversation = activeConversation else { return }

        let session: MSSession
        if let existingSession = conversation.selectedMessage?.session {
            session = existingSession
        } else {
            session = MSSession()
        }

        let message = MSMessage(session: session)
        let layout = MSMessageTemplateLayout()

        configurePollLayout(layout, pollInfo: pollInfo)
        layout.image = generatePollIcon()

        message.layout = layout
        message.url = url

        let summaryTitle = pollInfo?.title.isEmpty == false ? pollInfo!.title : "PlanToMeet Poll"
        message.summaryText = "Shared \(summaryTitle)"

        conversation.insert(message) { [weak self] error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Failed to insert message: \(error.localizedDescription)")
                    return
                }
                self?.requestPresentationStyle(.compact)
            }
        }
    }

    private func configurePollLayout(_ layout: MSMessageTemplateLayout, pollInfo: PollMessageInfo?) {
        if let info = pollInfo {
            layout.caption = info.title.isEmpty ? "PlanToMeet Poll" : info.title
            layout.subcaption = info.subtitle ?? "Tap to vote on available times"

            if let dateRange = info.dateRange, !dateRange.isEmpty {
                layout.trailingCaption = dateRange
            }

            if let responseCount = info.responseCount, responseCount > 0 {
                layout.trailingSubcaption = "\(responseCount) response\(responseCount == 1 ? "" : "s")"
            }
        } else {
            layout.caption = "PlanToMeet Poll"
            layout.subcaption = "Tap to vote on available times"
        }
    }

    // MARK: - Image Generation

    private func generatePollIcon() -> UIImage? {
        let size = CGSize(width: 300, height: 300)
        let renderer = UIGraphicsImageRenderer(size: size)

        return renderer.image { context in
            let colors = [
                UIColor(red: 59/255, green: 130/255, blue: 246/255, alpha: 1).cgColor,
                UIColor(red: 37/255, green: 99/255, blue: 235/255, alpha: 1).cgColor
            ]

            guard let gradient = CGGradient(
                colorsSpace: CGColorSpaceCreateDeviceRGB(),
                colors: colors as CFArray,
                locations: [0, 1]
            ) else {
                UIColor(red: 59/255, green: 130/255, blue: 246/255, alpha: 1).setFill()
                UIBezierPath(roundedRect: CGRect(origin: .zero, size: size), cornerRadius: 40).fill()
                return
            }

            let rect = CGRect(origin: .zero, size: size)
            let path = UIBezierPath(roundedRect: rect, cornerRadius: 40)
            context.cgContext.addPath(path.cgPath)
            context.cgContext.clip()

            context.cgContext.drawLinearGradient(
                gradient,
                start: CGPoint(x: 0, y: 0),
                end: CGPoint(x: size.width, y: size.height),
                options: []
            )

            let iconConfig = UIImage.SymbolConfiguration(pointSize: 120, weight: .medium)
            if let calendarIcon = UIImage(systemName: "calendar.badge.clock", withConfiguration: iconConfig) {
                let tinted = calendarIcon.withTintColor(.white, renderingMode: .alwaysOriginal)
                let iconSize = tinted.size
                let iconOrigin = CGPoint(
                    x: (size.width - iconSize.width) / 2,
                    y: (size.height - iconSize.height) / 2
                )
                tinted.draw(at: iconOrigin)
            }
        }
    }
}
