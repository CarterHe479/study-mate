'use server'

import { revalidatePath } from 'next/cache'

export async function deleteTodo(formData: FormData) {
  const id = formData.get('id')
  // TODO: Implement actual deletion logic
  revalidatePath('/admin')
} 