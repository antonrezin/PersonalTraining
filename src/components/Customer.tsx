import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button, Snackbar } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { ColDef } from "ag-grid-community";
import CsvDownloader from "react-csv-downloader";

// Define a Customer interface
interface Customer {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  _links?: any;
}

export default function Customer() {
  // States
  const [customers, setCustomers] = useState([]);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackmessage, setSnackMessage] = useState("");

  // Ag-grid fields
  const columnDefs: ColDef[] = [
    { field: "firstname", sortable: true, filter: true, floatingFilter: true },
    { field: "lastname", sortable: true, filter: true, floatingFilter: true },
    {
      field: "streetaddress",
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    { field: "postcode" },
    { field: "city", sortable: true, filter: true, floatingFilter: true },
    { field: "email", sortable: true, filter: true, floatingFilter: true },
    { field: "phone", sortable: true, filter: true, floatingFilter: true },
    {
      // Cellrenderer for delete button
      headerName: "",
      cellRenderer: (params: { data: Customer }) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteCustomer(params.data)}
        >
          Delete
        </Button>
      ),
      width: 120,
    },

    // Cellrenderer for edit button
    {
      headerName: "",
      cellRenderer: (params: { data: Customer }) => (
        <EditCustomer
          customer={params.data}
          onSave={updateCustomer}
          onCancel={handleCancel}
        />
      ),
      width: 120,
    },
  ];

  useEffect(() => {
    getCustomers();
  }, []);

  // Fetch all customers
  const getCustomers = () => {
    fetch(
      "https://customerrestservice-personaltraining.rahtiapp.fi/api/customers"
    )
      .then((response) => response.json())
      .then((responseData) => {
        setCustomers(responseData._embedded.customers);
      })
      .catch((error) => console.error(error));
  };

  // Delete customer
  const deleteCustomer = (customer: Customer) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      fetch(customer._links.customer.href, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setSnackMessage("The customer was deleted succesfully!");
            setOpenSnackBar(true);
            getCustomers();
          } else {
            window.alert("Something went wrong with deleting");
          }
        })
        .catch((error) => console.error(error));
    }
  };

  // Update customer
  const updateCustomer = (updatedCustomer: Customer) => {
    fetch(updatedCustomer._links.customer.href, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCustomer),
    })
      .then((repsonse) => {
        if (repsonse.ok) {
          setSnackMessage("The customer was updated successfully!");
          setOpenSnackBar(true);
          getCustomers();
        } else {
          window.alert("Something went wrong with saving");
        }
      })
      .catch((error) => console.error(error));
  };

  // Save new customer
  const handleSave = (newCustomer: Omit<Customer, "_links">) => {
    fetch(
      "https://customerrestservice-personaltraining.rahtiapp.fi/api/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      }
    )
      .then((response) => {
        if (response.ok) {
          setSnackMessage("The customer was saved successfully!");
          setOpenSnackBar(true);
        } else {
          window.alert("Something went wrong with saving");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleCancel = () => {};

  return (
    <>
      <AddCustomer onSave={handleSave} onCancel={handleCancel} />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: 1000, margin: "auto" }}
      >
        <AgGridReact
          rowData={customers}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={15}
        />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        message={snackmessage}
      />

      <CsvDownloader
        datas={customers}
        text="Export CSV"
        filename={"customerdata" + new Date().toLocaleString()}
        extension=".csv"
        className="btn-btn-success"
        style={{ color: "white" }}
      />
    </>
  );
}
