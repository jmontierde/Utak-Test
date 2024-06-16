import React, { useEffect, useState } from "react";
import { MenuItem } from "../types/menu";
import { database } from "../firebaseConfig";
import { ref, onValue, remove, set } from "firebase/database";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridRowId,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    const menuItemsRef = ref(database, "menuItems");
    onValue(menuItemsRef, (snapshot) => {
      const items = snapshot.val();
      const itemList: MenuItem[] = [];
      if (items) {
        Object.entries(items).forEach(([id, item]) => {
          itemList.push({ id, ...(item as MenuItem) });
        });
      }
      setMenuItems(itemList);
    });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `menuItems/${id}`));
      toast.success("Menu item deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item.");
    }
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = async (id: GridRowId) => {
    const updatedItem = menuItems.find((item) => item.id === id);
    if (updatedItem) {
      await set(ref(database, `menuItems/${id}`), updatedItem);
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = async (newRow: MenuItem) => {
    try {
      const updatedItems = menuItems.map((item) =>
        item.id === newRow.id ? { ...item, ...newRow } : item
      );
      setMenuItems(updatedItems);

      await set(ref(database, `menuItems/${newRow.id}`), newRow);
      toast.success("Menu item updated successfully!");
      return newRow;
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item.");
      throw error;
    }
  };

  const columns: GridColDef[] = [
    { field: "index", headerName: "Index", width: 120, headerAlign: "center" },
    {
      field: "category",
      headerName: "Category",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "options",
      headerName: "Options",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      width: 170,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      headerAlign: "center",
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;
        return isInEditMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSaveClick(params.id)}
            style={{ marginRight: 10 }}
          >
            Save
          </Button>
        ) : (
          <div className="space-x-3 flex">
            <Button
              sx={{
                color: "#ffffff", // Text color
                backgroundColor: "#25AE9C", // Background color
                "&:hover": {
                  backgroundColor: "#17a2b8", // Hover background color
                },
              }}
              onClick={() => handleEditClick(params.id)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                color: "#ffffff", // Text color
                backgroundColor: "#AD2437", // Background color
                "&:hover": {
                  backgroundColor: "#A20000", // Hover background color
                },
              }}
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = menuItems.map((item, index) => ({
    ...item,
    index: index + 1,
    options: Array.isArray(item.options)
      ? item.options.join(", ")
      : item.options || "None",
  }));

  return (
    <div className="h-auto w-full space-y-6">
      <h2 className="text-xl font-semibold">Items</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        processRowUpdate={processRowUpdate}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        getRowHeight={() => "auto"}
        sx={{
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center text in cells
            whiteSpace: "normal",
            wordWrap: "break-word",
            padding: "8px", // Add padding for better spacing
            lineHeight: "1.5em",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            textAlign: "center", // Center text in headers
            whiteSpace: "normal",
            wordWrap: "break-word",
          },
          "@media (max-width: 600px)": {
            "& .MuiDataGrid-root": {
              fontSize: "12px",
            },
          },
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default MenuList;
