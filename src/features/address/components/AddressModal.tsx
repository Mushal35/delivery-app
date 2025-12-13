import { X } from "lucide-react";

export function AddressModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress = {
      addressLine: formData.get("addressLine"),
      pincode: formData.get("pincode"),
    };

    onAdd(newAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-rose-900 mb-4">
          Add New Address
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-rose-900">
              Street Address
            </label>
            <input
              name="addressLine"
              required
              className="p-3 border border-rose-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="e.g. 123 Main St"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-rose-900">Zip Code</label>
            <input
              name="pincode"
              required
              className="p-3 border border-rose-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="400001"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-[#952C0B] transition-colors"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
