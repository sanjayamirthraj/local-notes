import GoogleMap from "@/components/GoogleMap";
import { fetchPins } from "@/lib/fetchPins";

export default async function PinMap() {
  const listOfPins = await fetchPins();
  return <GoogleMap pins={listOfPins} />;
}
