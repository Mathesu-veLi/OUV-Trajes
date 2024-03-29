import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { ButtonLoading } from '@/components/ButtonLoading';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

type TFormSchema = z.infer<typeof formSchema>;

export function Contact() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function sendEmail(messageForm: TFormSchema) {
    setIsLoading(true);

    if (
      !messageForm.firstName ||
      !messageForm.lastName ||
      !messageForm.email ||
      !messageForm.message
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    const template_params = {
      from_name: `${messageForm.firstName} ${messageForm.lastName}`,
      to_name: 'OUV',
      from_email: messageForm.email,
      message: messageForm.message,
    };

    await emailjs
      .send(
        process.env.SERVICE_KEY as string,
        process.env.CONTACT_TEMPLATE_KEY as string,
        template_params,
        {
          publicKey: process.env.PUBLIC_KEY as string,
        },
      )
      .then(() => {
        toast.success('Message sent successfully');
      });

    setIsLoading(false);
  }

  return (
    <div className="flex justify-center items-center lg:h-screen pt-32 lg:p-0 mb-10 lg:m-0">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-24 lg:p-10">
        <div className="max-w-72 flex gap-7 flex-col tracking-wider leading-relaxed p-2">
          <h1 className="text-3xl font-semibold">Contact Us</h1>
          <p className="text-lg text-gray-400">
            Email, call, or complete the form to send us a message without
            leaving the site
          </p>
          <a
            className="text-lg text-gray-400"
            href="mailto:matheuslevit@gmail.com"
          >
            matheuslevit@gmail.com
          </a>
          <a className="text-lg text-gray-400" href="tel:+5571985076263">
            +55 71 98507-6263
          </a>
        </div>
        <div className="border p-5 mx-3 rounded-md grid gap-5 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendEmail)}
              className="flex flex-col gap-5"
            >
              <h1 className="text-xl font-semibold">Send us a message</h1>
              <div className="flex gap-5 border-none">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="How can we help?"
                        id="message"
                        className="max-h-80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Send</Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
