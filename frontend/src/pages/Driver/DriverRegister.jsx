import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import Swal from "sweetalert2";

const DriverRegister = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    license_number: "",
    nid: "",
    experience_years: "",
    password: "",
    password_confirmation: "",
  });

  const [licenseImage, setLicenseImage] = useState(null);
  const [nidImage, setNidImage] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dsgoi1hul/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "car_rental";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const licenseUrl = await uploadImage(licenseImage);
      const nidUrl = await uploadImage(nidImage);
      const profileUrl = await uploadImage(profilePhoto);

      const payload = { ...form };
      if (licenseUrl) payload.license_image = licenseUrl;
      if (nidImage) payload.nid_image = nidUrl;
      if (profileUrl) payload.profile_photo = profileUrl;

      const res = await api.post("/driver/register", payload);

      Swal.fire("Success", res.data.message, "success");

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        license_number: "",
        nid: "",
        experience_years: "",
        password: "",
        password_confirmation: "",
      });
      setLicenseImage(null);
      setNidImage(null);
      setProfilePhoto(null);
    } catch (err) {
      Swal.fire("Error", res.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Driver Register" description="Become a driver" />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center mt-4">
          Driver Register
        </h2>

        {msg && <div className="mb-4 text-sm text-green-700"> {msg} </div>}

        <hr className="my-3" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              required
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              required
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-4">
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="enter@email.com"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              required
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <div className="">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-4">
            <input
              required
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="**********"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              required
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-4">
            <input
              required
              name="license_number"
              value={form.license_number}
              onChange={handleChange}
              placeholder="License Number"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              required
              name="nid"
              value={form.nid}
              onChange={handleChange}
              placeholder="NID Number"
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <div className="flex gap-4">
            <input
              required
              name="experience_years"
              type="number"
              value={form.experience_years}
              onChange={handleChange}
              placeholder="Years of Experience"
              className="flex-1 px-3 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="">
              <label className="block mb-1">License Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLicenseImage(e.target.files[0])}
              />
            </div>
            <div className="">
              <label className="block mb-1">NID Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNidImage(e.target.files[0])}
              />
            </div>
            <div className="">
              <label className="block mb-1">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#778BFF] text-white rounded"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DriverRegister;
