import { useState } from "react";
import MenuItemForm from "./components/MenuItemForm";
import { MenuItem } from "./types/menu";
import MenuList from "./components/MenuList";
import Navbar from "./layout/Navbar";

const App: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);

  const handleSave = () => {
    setCurrentItem(null);
  };

  return (
    <div className="w-10/12 h-auto mx-auto">
      <div className=" py-6 space-y-6">
        <Navbar />
        <hr className="w-full border-t border-gray-300" />

        <h1 className="text-2xl font-bold mb-6">Simple CRUD for Menu</h1>

        <MenuItemForm item={currentItem || undefined} onSave={handleSave} />
        <MenuList />
      </div>
    </div>
  );
};

export default App;
