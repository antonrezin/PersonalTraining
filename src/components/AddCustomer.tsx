import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

// Define the types for the props
interface AddCustomerProps {
  // Function type for saving a customer
  onSave: (customer: Customer) => void;
  // Function type for cancelling
  onCancel: () => void;
}

// Define the type for the customer object
interface Customer {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onSave, onCancel }) => {
  // Fields
  const [customer, setCustomer] = useState<Customer>({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    email: "",
    phone: "",
  });

  // State for dialog open/close
  const [open, setOpen] = useState<boolean>(false);

  // Functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset customer fields
    setCustomer({
      firstname: "",
      lastname: "",
      streetaddress: "",
      postcode: "",
      city: "",
      email: "",
      phone: "",
    });
  };

  const handleSave = () => {
    console.log("Saving customer: ", customer);
    onSave(customer);
    // Close the dialog after saving
    handleClose();
  };

  const handleCancel = () => {
    console.log("Cancellation of saving");
    onCancel();
    // Close the dialog after canceling
    handleClose();
  };

  // Dialog
  return (
    <>
      <Button onClick={handleClickOpen}>Add customer</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            value={customer.firstname}
            onChange={(e) =>
              setCustomer({ ...customer, firstname: e.target.value })
            }
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Last Name"
            value={customer.lastname}
            onChange={(e) =>
              setCustomer({ ...customer, lastname: e.target.value })
            }
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Street Address"
            value={customer.streetaddress}
            onChange={(e) =>
              setCustomer({ ...customer, streetaddress: e.target.value })
            }
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Postcode"
            value={customer.postcode}
            onChange={(e) =>
              setCustomer({ ...customer, postcode: e.target.value })
            }
            variant="standard"
          />
          <TextField
            margin="dense"
            label="City"
            value={customer.city}
            onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddCustomer;
