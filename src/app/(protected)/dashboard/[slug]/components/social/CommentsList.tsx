'use client';

const comments = [
  {
    id: 1,
    username: 'leonessi',
    comment: "I've said it time and time again lazy people will let this happen and wonder how to make money later 💰",
    time: '13min ago'
  },
  {
    id: 2,
    username: 'nurdin0101',
    comment: "When it comes to McDonald's I prefer robots over people. Less orders coming back incomplete and no attitude",
    time: '17 min ago'
  }
];

export function CommentsList() {
  return (
    <div className="mt-2">
      <div className="flex gap-4 text-sm mb-3">
        <button className="font-medium">Recent</button>
      </div>
      
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1">
              <div>
                <span className="font-medium text-sm">@{comment.username}</span>
                <span className="text-sm text-gray-600 ml-2">{comment.comment}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {comment.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}