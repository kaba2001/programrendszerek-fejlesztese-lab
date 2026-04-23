import { Box, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";

export const ContactCreate = () => {
  const {
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          {...register("partnerName", { required: "Name is required" })}
          label="Partner Name"
          error={!!errors.partnerName}
          helperText={errors.partnerName?.message as string}
          fullWidth
        />
        <TextField
          {...register("partnerAccountNumber", {
            required: "Account number is required",
          })}
          label="Partner Account Number"
          error={!!errors.partnerAccountNumber}
          helperText={errors.partnerAccountNumber?.message as string}
          fullWidth
        />
      </Box>
    </Create>
  );
};
