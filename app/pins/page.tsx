import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { fetchPins } from "@/lib/fetchPins";

export default async function Pins() {
  const pins = await fetchPins();
  return (
    <div className="p-4">
      <DataTable columns={columns} data={pins} />
    </div>
  );
}
