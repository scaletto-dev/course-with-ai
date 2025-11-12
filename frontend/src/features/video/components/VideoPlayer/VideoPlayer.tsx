interface VideoPlayerProps {
  videoUrl: string;
  lessonTitle: string;
}

export function VideoPlayer({ videoUrl, lessonTitle }: VideoPlayerProps) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
      <div className="aspect-video relative">
        <video
          className="w-full h-full"
          controls
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">{lessonTitle}</h1>
      </div>
    </div>
  );
}
