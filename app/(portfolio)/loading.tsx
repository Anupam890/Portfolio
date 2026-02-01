import { SpinnerCustom } from "@/components/ui/spinner";

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SpinnerCustom />
    </div>
  );
}

export default Loading;
