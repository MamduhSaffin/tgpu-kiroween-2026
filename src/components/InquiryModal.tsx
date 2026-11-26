import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'
import { saveInquiry } from '../lib/storage'
import type { Company } from '../data/companies'

interface Props {
  from: Company | null
  to: Company
  onClose: () => void
}

export default function InquiryModal({ from, to, onClose }: Props) {
  const [message, setMessage] = useState(
    `Dear ${to.contactName},\n\nI represent ${from?.name ?? 'our company'} and we are interested in exploring a potential partnership with ${to.name}.\n\nI would welcome the opportunity to discuss product fit, target markets and partnership requirements.\n\nKind regards`
  )
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const doneRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const trigger = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (sent) doneRef.current?.focus()
  }, [sent])

  function handleSend(event: React.FormEvent) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 20) {
      setError('Please enter at least 20 characters so the recipient understands your enquiry.')
      return
    }
    setError('')
    try {
      saveInquiry({
        fromCompanyId: from?.id ?? 'guest',
        toCompanyId: to.id,
        message: trimmedMessage,
      })
    } catch {
      setError('Could not save the enquiry. Check that browser storage is available and try again.')
      return
    }
    setSent(true)
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={event => { event.preventDefault(); onClose() }}
      aria-labelledby="inquiry-title"
      className="bg-white rounded-2xl shadow-2xl w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto backdrop:bg-black/50"
    >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 id="inquiry-title" className="font-semibold text-gray-900">Partnership Enquiry</h3>
            <p className="text-xs text-gray-500 mt-0.5">To: {to.name}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close enquiry dialog" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Enquiry Saved</h4>
            <p className="text-sm text-gray-500 mb-1">Your enquiry has been stored locally.</p>
            <p className="text-xs text-gray-400 italic">
              This is a demo prototype. No real message was sent.
            </p>
            <button
              type="button"
              ref={doneRef}
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-tgpu-navy text-white text-sm font-medium hover:bg-tgpu-blue transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              ⓘ Demo prototype — enquiries are saved to localStorage only. No real email is sent.
            </div>
            <div>
              <label htmlFor="inquiry-message" className="text-xs font-medium text-gray-700 mb-1 block">Message</label>
              <textarea
                id="inquiry-message"
                rows={8}
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={2000}
                aria-describedby={error ? 'inquiry-error' : undefined}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-tgpu-navy/20 focus:border-tgpu-navy transition"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span id="inquiry-error" role={error ? 'alert' : undefined} className={error ? 'text-red-600' : ''}>{error || 'Minimum 20 characters'}</span>
                <span>{message.length}/2000</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-tgpu-navy text-white text-sm font-medium hover:bg-tgpu-blue transition-colors flex items-center justify-center gap-2"
              >
                <Send size={14} /> Save Enquiry
              </button>
            </div>
          </form>
        )}
    </dialog>
  )
}
