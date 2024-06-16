import React, { useState } from "react";
import { MenuItem } from "../types/menu";
import { database } from "../firebaseConfig.ts";
import { ref, set, push } from "firebase/database";

interface Props {
  item?: MenuItem;
  onSave: () => void;
}

const MenuItemForm: React.FC<Props> = ({ item, onSave }) => {
  const [menuItem, setMenuItem] = useState<MenuItem>(
    item || {
      category: "",
      name: "",
      options: [],
      price: 0,
      cost: 0,
      stock: 0,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "options") {
      setMenuItem({
        ...menuItem,
        [name]: value.split(",").map((option) => option.trim()),
      });
    } else {
      setMenuItem({
        ...menuItem,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    if (menuItem.id) {
      await set(ref(database, `menuItems/${menuItem.id}`), menuItem);
    } else {
      await push(ref(database, "menuItems"), menuItem);
    }
    onSave();
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={menuItem.category}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={menuItem.name}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
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
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={menuItem.price}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Cost</label>
        <input
          type="number"
          name="cost"
          value={menuItem.cost}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={menuItem.stock}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm"
      >
        Save
      </button>
    </div>
  );
};

export default MenuItemForm;
