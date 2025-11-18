// import React, { useContext, useEffect, useState } from 'react';
// import { DoctorContext } from '../../context/DoctorContext';
// import { AppContext } from '../../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const DoctorProfile = () => {
//   const { dToken, profileData, setProfileData, getProfileData ,backendUrl } = useContext(DoctorContext);
//   const { currency } = useContext(AppContext);

// const [isEdit ,setIsEdit] = useState(false)

//  const updateProfile = async () => {


//   try {

//     const updateData = {
//       address: profileData.address,
//       fees: profileData.fees,
//       available: profileData.available
//     }
//     const {data} = await axios.post(backendUrl + '/api/doctor/update-profile',updateData,{headers:{ token :dToken}
      

//     })

//     if (data.success) {
//       toast.success(data.message)
//       setIsEdit(false)
//       getProfileData()
//   } else {
//       toast.error(data.message)
//   }
  


    
    
//   } catch (error) {

//     toast.error(error.message)
//     console.log(error)
    
//   }
//  }




//   useEffect(() => {
//     if (dToken) {
//       getProfileData();
//     }
//   }, [dToken]);

//   return profileData && (
//     <div >
//       <div className='flex flex-col gap-4 m-5'>
//         <div>
//           <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
//         </div>

//         <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
//   {/* ----- Doc Info : name, degree, experience ----- */}
//   <p  className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
//   <div className='flex items-center gap-2 mt-1 text-gray-600'>
//     <p>{profileData.degree} - {profileData.speciality}</p>
//     <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
//   </div>

//   {/* ------ Doc About ------ */}
//   <div>
//     <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
//     <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
//       {profileData.about}
//     </p>
//   </div>

//   <p className='text-gray-600 font-medium mt-4'>
//     Appointment fee: <span className='text-gray-800'>{currency} { isEdit ? <input type="number" onChange={(e)=>setProfileData(prev =>({...prev,fees:e.target.value}))} value={profileData.fees} />:profileData.fees}</span>
//   </p>
//   {/* <div  className='flex gap-2 py-2'>
//   <p>Address:</p>
//   <p className='text-sm'>
//     {isEdit ? <input type="text" onChange={(e)=> setProfileData(prev => ({...prev,address:{...prev.address,line1:e.target.value}}) )} value={profileData.address.line1} />: profileData.address.line1}
//     <br />
//     {isEdit ? <input type="text" onChange={(e)=> setProfileData(prev => ({...prev,address:{...prev.address,line2:e.target.value}}) )} value={profileData.address.line2} />: profileData.address.line2}
//   </p>
// </div> */}

// <div className="flex gap-2 py-2">
//   <p>Address:</p>

//   <p className="text-sm">
//     {isEdit ? (
//       <input
//         type="text"
//         value={profileData?.address?.line1 || ""}
//         onChange={(e) =>
//           setProfileData((prev) => ({
//             ...prev,
//             address: { ...prev.address, line1: e.target.value },
//           }))
//         }
//       />
//     ) : (
//       profileData?.address?.line1
//     )}

//     <br />

//     {isEdit ? (
//       <input
//         type="text"
//         value={profileData?.address?.line2 || ""}
//         onChange={(e) =>
//           setProfileData((prev) => ({
//             ...prev,
//             address: { ...prev.address, line2: e.target.value },
//           }))
//         }
//       />
//     ) : (
//       profileData?.address?.line2
//     )}
//   </p>
// </div>


// <div className='flex gap-1 pt-2'>
//   <input onChange={()=>isEdit && setProfileData(prev =>({...prev,available: !prev.available}))} checked={profileData.available} type="checkbox" name="" id="" />
//   <label htmlFor="">Available</label>
// </div>


// {
//     isEdit
//     ?  
// <button  onClick ={updateProfile}className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>

// : 
// <button  onClick ={()=> setIsEdit(true)}className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>

// }
// </div>
// </div>




// </div>

      
//   );
// };


// export default DoctorProfile;
import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        docId: profileData._id,   // REQUIRED BY BACKEND
        address: {
          line1: profileData.address?.line1 || "",
          line2: profileData.address?.line2 || ""
        },
        fees: Number(profileData.fees),
        available: profileData.available
      };

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        { headers: { token: dToken } }
      );

      if (data.success) {
        toast.success("Profile Updated Successfully");
        await getProfileData();   // refresh UI
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  return profileData && (
    <div className="flex flex-col gap-4 m-5">

      {/* Doctor Image */}
      <img
        className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
        src={profileData.image}
        alt="Doctor"
      />

      {/* Doctor Info Card */}
      <div className="flex-1 border rounded-lg p-8 bg-white">

        {/* Name + Degree */}
        <h1 className="text-3xl font-medium text-gray-700">{profileData.name}</h1>
        <p className="text-gray-600 mt-1">
          {profileData.degree} - {profileData.speciality}
          <button className="ml-2 py-0.5 px-2 border text-xs rounded-full">
            {profileData.experience}
          </button>
        </p>

        {/* About */}
        <div className="mt-3">
          <p className="font-medium">About:</p>
          <p className="text-sm text-gray-600">{profileData.about}</p>
        </div>

        {/* Fees */}
        <p className="text-gray-600 font-medium mt-4">
          Appointment fee:{" "}
          <span className="text-gray-800">
            {currency}{" "}
            {isEdit ? (
              <input
                type="number"
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData(prev => ({ ...prev, fees: e.target.value }))
                }
              />
            ) : (
              profileData.fees
            )}
          </span>
        </p>

        {/* Address */}
        <div className="mt-4">
          <p className="font-medium">Address:</p>
          <p className="text-sm text-gray-600">
            {isEdit ? (
              <>
                <input
                  type="text"
                  placeholder="Line 1"
                  value={profileData.address?.line1 || ""}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                />
                <br />
                <input
                  type="text"
                  placeholder="Line 2"
                  value={profileData.address?.line2 || ""}
                  onChange={(e) =>
                    setProfileData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                />
              </>
            ) : (
              <>
                {profileData.address?.line1}
                <br />
                {profileData.address?.line2}
              </>
            )}
          </p>
        </div>

        {/* Availability */}
        <div className="flex gap-2 mt-4">
          <input
            type="checkbox"
            checked={profileData.available}
            disabled={!isEdit}
            onChange={(e) =>
              setProfileData(prev => ({
                ...prev,
                available: e.target.checked
              }))
            }
          />
          <label>Available</label>
        </div>

        {/* Buttons */}
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
