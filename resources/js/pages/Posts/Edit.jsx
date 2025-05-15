import { useForm } from '@inertiajs/react'

export default function Edit({ post }) {
  const { data, setData, put, processing, errors } = useForm({
    title: post.title || '',
    content: post.content || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/posts/${post.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Edit Post</h1>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.title && <div className="text-red-500">{errors.title}</div>}
      </div>

      <div>
        <label>Content</label>
        <textarea
          value={data.content}
          onChange={(e) => setData('content', e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.content && <div className="text-red-500">{errors.content}</div>}
      </div>

      <button
        type="submit"
        disabled={processing}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </form>
  )
}
