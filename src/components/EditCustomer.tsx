import { useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Customer {
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
}

interface EditCustomerProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

export default function EditCustomer({
  customer,
  onSave,
  onCancel,
}: EditCustomerProps) {
  // States
  const [open, setOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);

  // Functions
  const handleClickOpen = () => {
    setEditedCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    onSave(editedCustomer);
    handleClose();
  };

  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Customer
  ) => {
    setEditedCustomer((prevCustomer) => ({
      ...prevCustomer,
      [field]: e.target.value,
    }));
  };

  // Dialog
  return (
    <>
      <Button onClick={handleClickOpen}>Edit</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="firstname"
            value={editedCustomer.firstname}
            onChange={(e) => handleInputChange(e, "firstname")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="lastname"
            value={editedCustomer.lastname}
            onChange={(e) => handleInputChange(e, "lastname")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="streetaddress"
            value={editedCustomer.streetaddress}
            onChange={(e) => handleInputChange(e, "streetaddress")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="postcode"
            value={editedCustomer.postcode}
            onChange={(e) => handleInputChange(e, "postcode")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="city"
            value={editedCustomer.city}
            onChange={(e) => handleInputChange(e, "city")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="email"
            value={editedCustomer.email}
            onChange={(e) => handleInputChange(e, "email")}
            variant="standard"
          />
          <TextField
            margin="dense"
            label="phone"
            value={editedCustomer.phone}
            onChange={(e) => handleInputChange(e, "phone")}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Update</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
