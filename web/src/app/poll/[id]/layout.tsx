import './poll-theme.css'

export default function PollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="poll-dark-theme min-h-screen">
      {children}
    </div>
  )
}
