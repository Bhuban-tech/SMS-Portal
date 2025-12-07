import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login'); // this will immediately redirect to /login
}
