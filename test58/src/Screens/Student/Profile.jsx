import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const [ExamAns,setExamAns] = useState({})
  const router = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    new: "",
    current: "",
  });
  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { enrollmentNo: router.state.loginid },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          setData(response.data.user[0]);
          // dispatch(
          //   setUserData({
          //     fullname: `${response.data.user[0].firstName} ${response.data.user[0].middleName} ${response.data.user[0].lastName}`,
          //     semester: response.data.user[0].semester,
          //     enrollmentNo: response.data.user[0].enrollmentNo,
          //     branch: response.data.user[0].branch
          //   })
          // );

          axios
          .post(`${baseApiURL()}/Exams/getExamsAnsId${response.data.user[0].semester}`,{userId:response.data.user[0].enrollmentNo})
          .then((response) => {
              let x = response.data.examFilter
              
              setExamAns(x);
          })
          .catch((error) => {
            toast.dismiss();
            toast.error(error.message);
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });

      
  }, [dispatch, router.state.loginid, router.state.type]);
  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/student/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        {
          headers: headers,
        }
      )
      .then((response) => {
        
        if (response.data.success) {
          
          changePasswordHandler(response.data.enrollmentNo);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  const changePasswordHandler = (id) => {
    console.log(router.state.loginid);
    console.log(password.new);
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/student/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new }, 
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setPassword({ new: "", current: "" });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };
  useEffect(() => {
    if(ExamAns && data){
      dispatch(
        setUserData({
          fullname: `${data.firstName} ${data.middleName} ${data.lastName}`,
          semester: data.semester,
          enrollmentNo: data.enrollmentNo,
          branch: data.branch,
          ExamAns:ExamAns
        })
      );
    }
}, [ExamAns,data]);

  return (
    <div className="w-[85%] mx-auto my-8 flex justify-between items-start">
      {data && (
        <>
          <div>
            <p className="text-2xl font-semibold   text-yellow-500">
              Hello {data.firstName} {data.middleName} {data.lastName}👋
            </p>
            <div className="mt-3">
              <p className="text-lg  text-yellow-500 font-normal mb-2">
                Enrollment No:  <span className="bg-gray-600 ml-2 text-white py-1 px-2 rounded">{data.enrollmentNo} </span>
              </p>
              <p className="text-lg  text-yellow-500 font-normal mb-2">Branch:  <span className="bg-gray-600 ml-2 text-white py-1 px-2 rounded">{data.branch} </span></p>
              <p className="text-lg  text-yellow-500 font-normal mb-2">
                Year : <span className="bg-gray-600 ml-2 text-white py-1 px-2 rounded">{data.semester} </span>
              </p>
              <p className="text-lg  text-yellow-500 font-normal mb-2">
                Phone Number: +02 <span className="bg-gray-600 ml-2 text-white py-1 px-2 rounded">0{data.phoneNumber} </span>
              </p>
              <p className="text-lg  text-yellow-500 font-normal mb-2">
                Email Address:<span className="bg-gray-600 ml-2 text-white py-1 px-2 rounded"> {data.email}</span>
              </p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-gray-800 text-white"
              }  px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 bg-gray-800 placeholder-gray-400 text-white outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 bg-gray-800 placeholder-gray-400 text-white outline-none rounded mt-4"
                />
                <button
                  className="mt-4  bg-green-400 px-3 py-1 rounded text-green-800 mb-1"
                  onClick={checkPasswordHandler}
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>

          <img
            src={data.profile}
            alt="student profile"
            className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
          />
        </>
      )}
    </div>
  );
};

export default Profile;
