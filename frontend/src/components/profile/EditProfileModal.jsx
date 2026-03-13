import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../features/users/usersSlice'
import toast from 'react-hot-toast'

export default function EditProfileModal({ user, onClose }) {
  const dispatch = useDispatch()
  const fileRef = useRef()
  const [form, setForm] = useState({ name: user.name || '', bio: user.bio || '', website: user.website || '' })
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(user.profilePicture || null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    if (avatar) formData.append('profilePicture', avatar)

    try {
      await dispatch(updateUser({ id: user._id, data: formData })).unwrap()
      toast.success('Profile updated!')
      onClose()
    } catch (e) {
      toast.error(e || 'Update failed')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-300 border border-dark-100 rounded-2xl w-full max-w-md overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-100">
          <h2 className="font-bold text-lg text-slate-100">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden bg-dark-100 border-2 border-dark-100 cursor-pointer shrink-0"
                onClick={() => fileRef.current.click()}
              >
                {preview ? (
                  <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-brand-500 text-white font-bold">
                    {user.name?.[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white text-sm">📷</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field text-sm"
              placeholder="Your name"
              maxLength={50}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="input-field text-sm resize-none"
              rows={3}
              placeholder="Tell the world about yourself"
              maxLength={160}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Website</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="input-field text-sm"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="flex gap-3 px-4 py-3 border-t border-dark-100">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
