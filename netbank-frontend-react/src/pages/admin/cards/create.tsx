import { Box, MenuItem, TextField } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";

export const AdminCardCreate = () => {
  const {
    saveButtonProps,
    register,
    control,
    formState: { errors },
  } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          {...register("accountId", { required: "Account ID is required" })}
          label="Account ID"
          error={!!errors.accountId}
          helperText={errors.accountId?.message as string}
          fullWidth
        />
        <Controller
          name="cardType"
          control={control}
          rules={{ required: "Card type is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Card Type"
              error={!!errors.cardType}
              helperText={errors.cardType?.message as string}
              fullWidth
            >
              <MenuItem value="VIRTUAL">Virtual</MenuItem>
              <MenuItem value="PHYSICAL">Physical</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </Create>
  );
};
