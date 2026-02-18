import SwiftUI

// MARK: - Onboarding Page Model

private struct OnboardingPage {
    let systemImage: String
    let imageColor: Color
    let title: String
    let subtitle: String
}

// MARK: - Onboarding View

struct OnboardingView: View {
    @EnvironmentObject private var appState: AppState
    @State private var currentPage = 0

    private let pages: [OnboardingPage] = [
        OnboardingPage(
            systemImage: "calendar.badge.checkmark",
            imageColor: Theme.accentBlue,
            title: "Scheduling for the\nreal world",
            subtitle: "Stop sending endless \"when are you free?\" messages. PlanToMeet finds the time that works for everyone — automatically."
        ),
        OnboardingPage(
            systemImage: "message.fill",
            imageColor: .green,
            title: "Share right from\niMessage",
            subtitle: "Open any conversation in Messages, tap the + button, and select PlanToMeet. Your poll is sent as a tap-to-vote link."
        ),
        OnboardingPage(
            systemImage: "person.3.fill",
            imageColor: Theme.accentBlue,
            title: "Everyone votes —\nno account needed",
            subtitle: "Recipients tap the link and vote instantly from any device. No sign-up, no download required. Just pick a time."
        ),
    ]

    var body: some View {
        ZStack {
            AuthKitBackground()

            VStack(spacing: 0) {
                Spacer()

                // Page content
                TabView(selection: $currentPage) {
                    ForEach(pages.indices, id: \.self) { index in
                        pageView(pages[index])
                            .tag(index)
                    }
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .frame(height: 420)

                // Page indicator dots
                HStack(spacing: 8) {
                    ForEach(pages.indices, id: \.self) { index in
                        Circle()
                            .fill(index == currentPage ? Theme.accentBlue : Theme.textTertiary)
                            .frame(width: index == currentPage ? 8 : 6, height: index == currentPage ? 8 : 6)
                            .animation(.spring(response: 0.3), value: currentPage)
                    }
                }
                .padding(.top, 24)

                Spacer()

                // Action buttons
                VStack(spacing: 12) {
                    if currentPage < pages.count - 1 {
                        Button {
                            withAnimation(.spring(response: 0.4)) {
                                currentPage += 1
                            }
                        } label: {
                            Text("Next")
                                .primaryButtonStyle()
                        }

                        Button {
                            appState.completeOnboarding()
                        } label: {
                            Text("Skip")
                                .font(.subheadline)
                                .foregroundColor(Theme.textTertiary)
                        }
                    } else {
                        Button {
                            appState.completeOnboarding()
                        } label: {
                            Text("Get Started")
                                .primaryButtonStyle()
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
        }
    }

    // MARK: - Page View

    @ViewBuilder
    private func pageView(_ page: OnboardingPage) -> some View {
        VStack(spacing: 28) {
            // Icon
            ZStack {
                Circle()
                    .fill(page.imageColor.opacity(0.15))
                    .frame(width: 120, height: 120)

                Image(systemName: page.systemImage)
                    .font(.system(size: 52))
                    .foregroundColor(page.imageColor)
            }

            // Text
            VStack(spacing: 12) {
                Text(page.title)
                    .font(.title.bold())
                    .foregroundColor(Theme.textPrimary)
                    .multilineTextAlignment(.center)

                Text(page.subtitle)
                    .font(.body)
                    .foregroundColor(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(.horizontal, 32)
        }
        .padding(.vertical, 20)
    }
}

// MARK: - Preview

#Preview {
    OnboardingView()
        .environmentObject(AppState.shared)
}
