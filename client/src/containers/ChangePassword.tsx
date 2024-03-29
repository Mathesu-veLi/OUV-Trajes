import { ButtonLoading } from '@/components/ButtonLoading';
import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { api } from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

const formSchema = z
  .object({
    password: z.string().min(5).max(25),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type TFormSchema = z.infer<typeof formSchema>;

export function ChangePassword() {
  const navigate = useNavigate();
  const { reset, token } = useUserStore();
  const { id } = useUserStore().userData;
  const { token: tokenParam } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function changePassword(editPasswordForm: TFormSchema) {
    setIsLoading(true);
    await api
      .patch(
        `/users/${id}`,
        {
          password: editPasswordForm.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success('User password successfully changed!');
        reset();

        toast('Please log in again');
        navigate('/login');
      })
      .catch((err) => toast.error(err.response.data.message));
    setIsLoading(false);
  }

  useEffect(() => {
    if (!id) {
      toast.error('Please log in first');
      return navigate('/login');
    }

    if (tokenParam !== token) {
      toast.error('Invalid token');
      reset();

      toast('Please log in again');
      navigate('/login');
    }

    api.get(`/users/${id}`).catch((err) => {
      toast.error(err.response.data.message);
      return navigate('/dashboard');
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen lg:pt-0">
      <div className="p-5 lg:p-10 flex flex-col justify-center items-center gap-8 lg:w-2/6">
        <h1 className="font-bold text-2xl">Change Password</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(changePassword)}
            action=""
            className="w-full flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="password123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="password123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit">Change</Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
