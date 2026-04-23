import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import {
  NumberField,
  Show,
  TextFieldComponent as TextField,
} from "@refinedev/mui";

export const AccountShow = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Typography variant="body2" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />
        <Typography variant="body2" fontWeight="bold">
          Account Number
        </Typography>
        <TextField value={record?.accountNumber} />
        <Typography variant="body2" fontWeight="bold">
          Balance
        </Typography>
        <NumberField value={record?.balance ?? ""} />
        <Typography variant="body2" fontWeight="bold">
          Currency
        </Typography>
        <TextField value={record?.currency} />
        <Typography variant="body2" fontWeight="bold">
          Status
        </Typography>
        <TextField value={record?.status} />
      </Stack>
    </Show>
  );
};
