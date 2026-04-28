import { DeleteButton, type DeleteButtonProps } from '@refinedev/mui'
import { useQueryClient } from '@tanstack/react-query'

export const RefreshDeleteButton = (props: DeleteButtonProps) => {
  const queryClient = useQueryClient()
  return (
    <DeleteButton
      {...props}
      onSuccess={() => {
        queryClient.invalidateQueries()
        props.onSuccess?.()
      }}
    />
  )
}
