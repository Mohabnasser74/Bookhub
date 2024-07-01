import { useState, useEffect } from "react";
import { api } from "../../App";
import { useUser } from "../UserProvider";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { useParams } from "react-router-dom";

const Overveiw = ({ isUserFound }) => {
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const { user, setUser } = useUser();

  const { username } = useParams();

  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const [company, setCompany] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (user.user) {
      setName(user.user.name || "");
      setBio(user.user.bio || "");
      setCompany(user.user.company || "");
      setLocation(user.user.location || "");
    }
  }, [user.user?.name]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${api}/users/${user.user.login}/edit-profile`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            bio,
            company,
            location,
          }),
        }
      );
      const data = await response.json();

      if (data.code === 200) {
        setUser({ loggedIn: true, user: data.user });
        setEditProfile(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {isUserFound && (
        <div className="p-2 flex gap-5">
          <div className="flex flex-col gap-3 w-52">
            <img
              className="rounded-full border-1 border-gray-400 border-solid"
              src={`${api}/${user.user?.avatar_url}`}
              alt="User Avatar"
              width="200"
              height="200"
            />
            <div className={`${editProfile && "hidden"} flex flex-col gap-3`}>
              <div className="flex flex-col">
                {user.user?.name && (
                  <span className="font-bold text-3xl">{user.user.name}</span>
                )}
                {user.user?.login && <span>{user.user.login}</span>}
              </div>
              {user.user?.bio && <span>{user.user.bio}</span>}
              <button
                className="border border-y-gray-600 border-solid rounded-md text-green-500 hover:bg-zinc-800"
                onClick={() => setEditProfile(true)}>
                edit profile
              </button>
              <div className="flex flex-col gap-1">
                {user.user?.location && (
                  <span className="flex items-center gap-1">
                    <IoLocationOutline />
                    {user.user.location}
                  </span>
                )}
                {user.user?.company && (
                  <span className="flex items-center gap-1">
                    <HiOutlineOfficeBuilding />
                    {user.user.company}
                  </span>
                )}
              </div>
            </div>
            {editProfile && (
              <div className="flex flex-col gap-2">
                <label className="text-green-500" htmlFor="name">
                  name
                </label>
                <input
                  id="name"
                  type="text"
                  className="px-2 border-2 border-sky-400 rounded outline-none text-white bg-transparent"
                  placeholder="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                <label className="text-green-500" htmlFor="bio">
                  bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  className="px-2 border-2 border-sky-400 rounded outline-none text-white bg-transparent"
                  placeholder="bio"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}></textarea>
                <label className="text-green-500" htmlFor="location">
                  location
                </label>
                <input
                  id="location"
                  type="text"
                  className="px-2 border-2 border-sky-400 rounded outline-none text-white bg-transparent"
                  placeholder="location"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                />
                <label className="text-green-500" htmlFor="company">
                  company
                </label>
                <input
                  id="company"
                  type="text"
                  className="px-2 border-2 border-sky-400 rounded outline-none text-white bg-transparent"
                  placeholder="company"
                  onChange={(e) => setCompany(e.target.value)}
                  value={company}
                />
                <div>
                  <button
                    className="bg-green-500 hover:bg-green-400 p-1 my-2 border-2 border-darkseagreen-400 rounded text-center text-white font-semibold text-lg"
                    onClick={handleSaveProfile}>
                    save
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-400 p-1 my-2 border-2 border-darkseagreen-400 rounded text-center text-white font-semibold text-lg"
                    onClick={() => setEditProfile(false)}>
                    cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="w-full relative">
            <h1>popular repositories</h1>
            {user.user?.count_repos <= 0 && (
              <div className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {user.user?.login === username ? (
                  <span>
                    <span className="text-green-500">You</span> doesn’t have any
                    repositories yet.
                  </span>
                ) : (
                  <span>
                    <span className="text-green-500">{username}</span> doesn’t
                    have any repositories yet.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {!isUserFound && (
        <h1 className="text-3xl font-bold text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Oops! We can’t find that page.
        </h1>
      )}
    </div>
  );
};

export default Overveiw;
