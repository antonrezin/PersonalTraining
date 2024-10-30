import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { format } from "date-fns";
import { Button, Snackbar } from "@mui/material";
import AddTraining from "./AddTraining";
import { Link } from "react-router-dom";

// Define interfaces for the data types
interface Customer {
  firstname: string;
  lastname: string;
}

interface Training {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customer: Customer;
}

export default function Training() {
  // States
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [openSnackbar, setOpenSnackBar] = useState<boolean>(false);
  const [snackmessage, setSnackMessage] = useState<string>("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fields
  const columnDefs = [
    {
      field: "date",
      valueFormatter: (params: { value: string }) =>
        format(new Date(params.value), "dd.MM.yyyy HH:mm"),
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    { field: "duration", sortable: true, filter: true, floatingFilter: true },
    { field: "activity", sortable: true, filter: true, floatingFilter: true },
    {
      headerName: "Customer",
      valueGetter: (params: { data: Training }) => {
        const customer = params.data.customer;
        return `${customer.firstname} ${customer.lastname}`;
      },
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "",
      cellRenderer: (params: { data: Training }) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteTraining(params.data)}
        >
          Delete
        </Button>
      ),
      width: 120,
    },
  ] as const; // Use 'as const' to ensure type inference for column definitions

  // Getting trainings and information of customers
  useEffect(() => {
    getTrainings();
    getCustomers();
  }, []);

  // Getting all trainings
  const getTrainings = () => {
    fetch(
      "https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch trainings");
        }
        return response.json();
      })
      .then((responseData) => {
        setTrainings(responseData);
      })
      .catch((error) => console.error(error));
  };

  // Getting all information of customers
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

  // Harjoituksen poistaminen
  const deleteTraining = (training: Training) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      fetch(
        `https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${training.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete training: ${response.status}`);
          }
          setSnackMessage("The training was deleted successfully!");
          setOpenSnackBar(true);
          getTrainings();
        })
        .catch((error) => {
          console.error(error);
          window.alert("Something went wrong with deleting");
        });
    }
  };

  // Saving new training
  const handleSave = () => {
    const selectedCustomer = customers.find(
      (customer) =>
        customer.firstname === trainings[0].customer.firstname &&
        customer.lastname === trainings[0].customer.lastname
    );

    if (!selectedCustomer) {
      window.alert("Customer not found!");
      return;
    }

    const isoDate = new Date(trainings[0].date).toISOString();

    const trainingToAdd = {
      date: isoDate,
      activity: trainings[0].activity,
      duration: trainings[0].duration,
      customer: selectedCustomer,
    };

    fetch(
      "https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingToAdd),
      }
    )
      .then((response) => {
        if (response.ok) {
          setSnackMessage("The training was saved successfully!");
          setOpenSnackBar(true);
          getTrainings();
        } else {
          window.alert("Something went wrong with saving");
        }
      })
      .catch((error) => {
        console.error(error);
        window.alert("An error occurred while processing the request");
      });
  };

  const handleCancel = () => {};

  return (
    <>
      <AddTraining
        customers={customers} // Ensure AddTraining accepts Customer[] type
        onSave={handleSave}
        onCancel={handleCancel}
        trainings={trainings}
      />
      <div
        className="ag-theme-material"
        style={{ height: 600, width: 1000, margin: "auto" }}
      >
        <AgGridReact<Training>
          rowData={trainings}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={9}
        />
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        message={snackmessage}
      />
      <Link to="/statistics">Go to Statistics</Link>
    </>
  );
}
