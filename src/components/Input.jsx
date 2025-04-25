import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function Input() {
  const [text, setText] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [bioUser, setBioUser] = useState([]);
  const [nameUser, setNameUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verify_Search, setVerifySearch] = useState(true);
  const api_key = import.meta.env.VITE_GITHUB_SECRET;

  const handleBio = async (dataItems) => {
    console.log(dataItems);
    if (dataItems.length !== 0) {
      const biosAndNames = await Promise.all(
        dataItems.map(async (user) => {
          const response = await fetch(
            `https://api.github.com/users/${user.login}`,
            {
              headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${api_key}`,
                "X-GitHub-Api-Version": "2022-11-28",
              },
            }
          );
          const data = await response.json();
          console.log(data);
          return [data.bio, data.name];
        })
      );

      console.log(biosAndNames);
      // Separar os dados em dois arrays:
      const bios = biosAndNames.map(([bio, _]) => bio);
      const names = biosAndNames.map(([_, name]) => name);

      setBioUser(bios);
      setNameUser(names); // <- você precisa ter um useState para isso também
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    let response = await fetch(
      `https://api.github.com/search/users?q=${encodeURIComponent(text)}`
    );
    let data = await response.json();
    setDataUser(data.items || []);
    await handleBio(data.items);
    data.items.length != 0 ? setVerifySearch(true) : setVerifySearch(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
      <img src="/Group1.png" alt="" />
      <form
        onSubmit={handleSearch}
        className="w-[50%] sm-custom:w-full h-fit relative flex flex-row justify-center items-center"
      >
        <input
          type="text"
          placeholder="Digite um usuário do Github"
          className="w-full h-10 p-3 rounded-lg placeholder:text-black sm-custom:p-2"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-blue-700 p-2 absolute rounded-lg right-2">
          <CiSearch className="text-white" />
        </button>
      </form>
      <div className="h-fit w-full bg-transparent flex justify-center items-center text-center">
        {isLoading ? (
          <div className="text-white">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        ) : dataUser.length == 0 && !isLoading && !verify_Search ? (
          <div className="w-[60%] break-words text-red-600 bg-[#D9D9D9] text-center flex flex-row justify-center items-center gap-10 p-5 rounded-xl">
            Nenhum perfil foi encontrado com esse nome de usuário. <br></br>{" "}
            Tente novamente.
          </div>
        ) : dataUser.length == 1 && !isLoading ? (
          <div className="w-[60%] break-words bg-[#D9D9D9] text-center flex flex-row justify-center items-center gap-10 p-5 rounded-xl">
            <img
              src={dataUser[0].avatar_url}
              alt="avatar"
              className="w-[200px] h-[200px] rounded-[200px] border-[2px] border-blue-700"
            />
            <div className="flex flex-col justify-center text-left items-start gap-4">
              <h1 className="text-[#005CFF] font-semibold text-[20px]">
                {nameUser[0] == null ? dataUser[0].user : nameUser[0]}
              </h1>
              {bioUser[0] == null ? null : (
                <p className="text-[14px]">{bioUser[0]}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full bg-transparent relative flex justify-center items-center">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              className="!w-full bg-black/[0.1]"
            >
              {dataUser.map((user, index) => (
                <SwiperSlide
                  key={index}
                  className="rounded-lg bg-black/[0.1] !flex !justify-center"
                >
                  <div className="w-[60%] sm-custom:w-fit break-words bg-[#D9D9D9] text-center flex flex-row justify-center items-center gap-10 p-5 rounded-xl">
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-[200px] h-[200px] rounded-[200px] border-[2px] border-blue-700 sm-custom:w-[80px] sm-custom:h-[80px]"
                    />
                    <div className="flex flex-col justify-center text-left items-start gap-4">
                      <h1 className="text-[#005CFF] font-semibold text-[20px]">
                        {nameUser[index] == null ? user.login : nameUser[index]}
                      </h1>
                      {bioUser[index] == null ? null : (
                        <p className="text-[14px]">{bioUser[index]}</p>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}

/*
dataUser.map((item) => (
  <div className="flex flex-row gap-5 justify-center items-center w-[80%] h-fit">
    <img
      src={item.avatar_url}
      className="w-[20%] h-[20%] rounded-xl"
      alt=""
    />

    <h1>{item.login}</h1>
  </div>
))*/

export default Input;
