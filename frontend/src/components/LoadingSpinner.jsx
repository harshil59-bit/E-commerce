export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={fullScreen ? "flex min-h-screen items-center justify-center" : "flex items-center justify-center py-10"}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
    </div>
  );
}
