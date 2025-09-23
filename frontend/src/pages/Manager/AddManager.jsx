import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";

const AddManager = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [manager, setManager] = useState([]);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/managers");
      setManager(res.data.data || res.data);
    } catch (err) {
      console.log(err);
      
    }
  };

  useEffect(()=>{
    fetchManagers();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/managers", { name, email });
      setMessage(
        `${res.data.message} Temp Password:${res.data.default_password}`
      );
      setName("");
      setEmail("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };


const handleDelete = async (id) => {
  if(!confirm("Delete this manager?")) return;
  try{
    await api.delete(`/managers/${id}`)
    setMessage("Manager Deleted!");
    fetchManagers();
  }catch (err){
    setMessage(err.response?.data?.message || "Delete Failed!");
  }
}

  return (
    <>
      <PageMeta
        title="Add Manager | Dashboard"
        description="This is Add Manager page"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Manager
        </h2>
        <hr className="mb-5" />
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto my-3 border-2 border-black rounded-lg p-6"
        >
          {message && (
            <div className="mb-4 text-sm text-green-700">{message}</div>
          )}
          <div className="mb-3">
            <label htmlFor="" className="block mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="" className="block mb-1">
              Email
            </label>
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#4860FF] text-white rounded"
          >
            {loading ? "Creating..." : "Create Manager"}
          </button>
        </form>
      </div>

      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-4 text-center">Manager List</h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Created At</th>
            <th className="border px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {manager.length === 0 ?(
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500 italic">No Managers Found</td>
            </tr>
          ):(
            manager.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2"> {m.id} </td>
                <td className="border px-4 py-2"> {m.name} </td>
                <td className="border px-4 py-2"> {m.email} </td>
                <td className="border px-4 py-2"> {new Date(m.created_at).toLocaleDateString()} </td>
                <td className="border px-4 py-2"> 
                  <button className="text-[#4860FF] hover:underline mr-2">View</button>
                  <button onClick={()=>handleDelete(m.id)} className="text-red-500 hover:underline mr-2">Delete</button>
                   </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default AddManager;
