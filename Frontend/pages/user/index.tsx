import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useAPI from "../../hooks/useAPI";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  return (
    <Layout>
      <h1 className="text-5xl font-semibold mt-12">Profile</h1>

      <UsernameForm />
      <PasswordForm />
    </Layout>
  )
}

function UsernameForm() {
  const { user } = useAuth();
  const api = useAPI();
  const [value, setValue] = useState(user?.username);

  useEffect(() => {
    setValue(user?.username);
  },[user]);

  const usernameMutation = useMutation({
    mutationFn: (formData) => {
      return api.put(`users/${user?.user_id}/`, {body: formData});
    },
    enabled: !!user
  });

  const onSubmit = (e) => {
    e.preventDefault();
    usernameMutation.mutate(new FormData(e.target));
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold mt-6">Change Username</h2>
      <label>Username:
        <input name="username" type="text" value={value} onChange={e => {setValue(e.target.value)}}/>
      </label>
      <button type="submit">Update Username</button>
    </form>
  )
}

function PasswordForm() {
  const { user } = useAuth();
  const api = useAPI();
  const [value, setValue] = useState("");
  const [revalue, setRevalue] = useState("");

  const passwordMutation = useMutation({
    mutationFn: (formData) => {
      return api.put(`users/${user?.user_id}/`, {body: formData});
    },
    enabled: !!user && value === revalue,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    passwordMutation.mutate(new FormData(e.target));
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold mt-6">Change Password</h2>
      <input name="username" type="hidden" value={user?.username} />
      <label>Password:
        <input name="password" type="password" value={value} onChange={e => {setValue(e.target.value)}}/>
      </label>
      <label>Reenter Password:
        <input name="repassword" type="password" value={revalue} onChange={e => {setRevalue(e.target.value)}}/>
      </label>
        <button type="submit">Update Password</button>
    </form>
  )
}
