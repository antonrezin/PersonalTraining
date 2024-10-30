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
interface AddTrainingProps {
  onSave: (training: Training) => void;
  onCancel: () => void;
  customers: string[];
}

// Define the type for the training object
interface Training {
  date: string;
  duration: string;
  activity: string;
  customerId: string;
}

const AddTraining: React.FC<AddTrainingProps> = ({
  onSave,
  onCancel,
  customers,
}) => {
  // State for training fields
  const [training, setTraining] = useState<Training>({
    date: "",
    duration: "",
    activity: "",
    customerId: "",
  });

  const [open, setOpen] = useState<boolean>(false);

  // Functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset training fields
    setTraining({
      date: "",
      duration: "",
      activity: "",
      customerId: "",
    });
  };

  const handleSave = () => {
    console.log("Saving training: ", training);
    console.log("Customer list: ", customers);
    onSave(training);
    handleClose();
  };

  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  // Dialog
  return (
    <>
      <Button onClick={handleClickOpen}>Add training</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label=""
            type="datetime-local"
            value={training.date}
            onChange={(e) => setTraining({ ...training, date: e.target.value })}
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Duration"
            type="text"
            value={training.duration}
            onChange={(e) =>
              setTraining({ ...training, duration: e.target.value })
            }
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Activity"
            type="text"
            value={training.activity}
            onChange={(e) =>
              setTraining({ ...training, activity: e.target.value })
            }
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Customer"
            value={training.customerId}
            onChange={(e) =>
              setTraining({ ...training, customerId: e.target.value })
            }
            variant="standard"
            fullWidth
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

export default AddTraining;
