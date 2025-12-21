interface TagGroupProps {
  title: string
  tags: string[]
}

export default function TagGroup({ title, tags }: TagGroupProps) {

  return (
    <div className="mb-4">
      <h4 className="text-fs-4 font-medium mb-2 text-white-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-smoky-black">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-sm bg-eerie-black-2 text-light-gray border border-eerie-black-1 hover:border-orange-yellow-crayola transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
