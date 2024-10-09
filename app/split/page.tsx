import SplitViewClient from "@/components/SplitView";
import { fetchPins } from "@/lib/fetchPins";

export default async function SplitView() {
  const pins = await fetchPins();

  return <SplitViewClient pins={pins} />;
}
