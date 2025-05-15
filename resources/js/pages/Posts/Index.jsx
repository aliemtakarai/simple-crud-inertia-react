import { Link, useForm } from '@inertiajs/react'

export default function Index({ posts }) {
  const { delete: destroy } = useForm()

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">All Posts</h1>
        <Link
          href="/posts/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Create Post
        </Link>
      </div>

      <div className="bg-white rounded shadow p-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-2">
                <h2 className="text-lg text-gray-700 font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-700">{post.content}</p>
                <div className="flex gap-4 mt-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => destroy(`/posts/${post.id}`)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
