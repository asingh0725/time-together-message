import SwiftUI

@main
struct PlanToMeetClipApp: App {
    @StateObject private var appState = AppState.shared

    var body: some Scene {
        WindowGroup {
            AppClipRootView()
                .environmentObject(appState)
                .preferredColorScheme(.dark)
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                    handleIncomingURL(activity.webpageURL)
                }
                .onOpenURL { url in
                    handleIncomingURL(url)
                }
        }
    }

    private func handleIncomingURL(_ url: URL?) {
        guard let url = url else { return }

        // Extract poll ID from URL path: plantomeet.app/poll/{id}
        let pathComponents = url.pathComponents
        if let pollIndex = pathComponents.firstIndex(of: "poll"),
           pollIndex + 1 < pathComponents.count {
            let pollId = pathComponents[pollIndex + 1]
            NotificationCenter.default.post(
                name: .appClipPollIdReceived,
                object: nil,
                userInfo: ["pollId": pollId]
            )
        }
    }
}

extension Notification.Name {
    static let appClipPollIdReceived = Notification.Name("appClipPollIdReceived")
}
