import { IconButton } from './ui/icon-button'
import { CopyIcon } from 'lucide-react'
import { WebhooksList } from './webhooks-list'

export function Sidebar() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-6">
        <h1 className="flex items-baseline">
          <span className="font-semibold text-zinc-100">Webhook</span>
          <span className="font-normal text-zinc-400">.inspect</span>
        </h1>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
        <div className="flex-1 min-w-0 flex items-center gap-1 text-xs font-mono text-zinc-300">
          <span className="truncate">http://localhost:3333/capture</span>
        </div>
        <IconButton icon={<CopyIcon className="size-4" />} />
      </div>

      <WebhooksList />
    </div>
  )
}
