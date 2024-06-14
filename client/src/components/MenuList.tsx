import React, { useEffect, useState } from "react";
import { MenuItem } from "../types/menu";
// import { database } from '../firebase';
import { database } from "../firebaseConfig";
import { ref, onValue, remove } from "firebase/database";

interface Props {
  onEdit: (item: MenuItem) => void;
}

const MenuList: React.FC<Props> = ({ onEdit }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const menuItemsRef = ref(database, "menuItems");
    onValue(menuItemsRef, (snapshot) => {
      const items = snapshot.val();
      const itemList: MenuItem[] = [];
      for (let id in items) {
        itemList.push({ id, ...items[id] });
      }
      setMenuItems(itemList);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await remove(ref(database, `menuItems/${id}`));
  };

  return (
    <div className="max-w-md mx-auto">
      {menuItems.map((item) => (
        <div key={item.id} className="p-4 mb-4 bg-white shadow-md rounded-md">
          <div className="mb-2">
            <strong>Category:</strong> {item.category}
          </div>
          <div className="mb-2">
            <strong>Name:</strong> {item.name}
          </div>
          <div className="mb-2">
            <strong>Options:</strong> {item.options?.join(", ") || "None"}
          </div>
          <div className="mb-2">
            <strong>Price:</strong> ${item.price}
          </div>
          <div className="mb-2">
            <strong>Cost:</strong> ${item.cost}
          </div>
          <div className="mb-2">
            <strong>Stock:</strong> {item.stock}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => onEdit(item)}
              className="py-1 px-2 bg-yellow-500 text-white rounded-md shadow-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id!)}
              className="py-1 px-2 bg-red-500 text-white rounded-md shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
