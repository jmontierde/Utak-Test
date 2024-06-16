import React, { useState } from "react";
import { MenuItem } from "../types/menu";
import { database } from "../firebaseConfig.ts";
import { ref, set, push } from "firebase/database";

import { toast } from "react-toastify";

interface Props {
  item?: MenuItem;
  onSave: () => void;
}

const MenuItemForm: React.FC<Props> = ({ item, onSave }) => {
  const initialState: MenuItem = item || {
    category: "",
    name: "",
    options: [],
    price: 0,
    cost: 0,
    stock: 0,
  };

  const [menuItem, setMenuItem] = useState<MenuItem>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMenuItem({
      ...menuItem,
      [name]: name === "options" ? value.split(",") : value,
    });
  };

  const handleSave = async () => {
    try {
      if (menuItem.id) {
        await set(ref(database, `menuItems/${menuItem.id}`), menuItem);
      } else {
        await push(ref(database, "menuItems"), menuItem);
      }
      setMenuItem(initialState);
      onSave();
      toast.success("Menu item saved successfully!");
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  return (
    <div className="py-4  rounded">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:space-x-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={menuItem.category}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={menuItem.name}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <input
            type="text"
            name="options"
            value={menuItem.options}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:space-x-6 ">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={menuItem.price}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            type="number"
            name="cost"
            value={menuItem.cost}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={menuItem.stock}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded shadow-sm"
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleSave}
            className="w-full  py-[10px] px-4 bg-[#25AE9C] hover:bg-[#17a2b8] text-white rounded shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;
