import React, { Component } from "react";

import axios from "axios";
import { toast } from "react-toastify";

export default class EditOrderInfo extends Component {
  state = {
    // lodintable: true,
    loading: false,
    // loadingbtn: false,
    fullName: "",
    lodintable: true,
    empfullName: "",
    date: "",
    time: "",
    allHandyman: [],
    cityId: "",
    cities: [],
    services: [],
    allSteps: [],
    customerId: "",
    employeeId: "",
    handyManId: "",
    datePrefered: "",
    serviceId: "",
    orderStepId: "",
    offerId: "",
    orderDetails: "",
    orderComments: "",
    orderNotes: "",
    price: 0,
    offerPrice: 0,
    priceAfterOffer: 0,
  };

  componentDidMount() {
    const orderId = this.props.match.params.id;
    axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/Orders/GetAllOrdersByStep/6e0d1ff9-b2f5-4a29-b4fb-08d976563b97"
      )
      .then((res) => {
        const orderInfo = res.data.data.filter((da) => da.id === orderId);
        console.log(orderInfo[0].datePrefered.split("T")[0]);
        this.setState({
          cityId: orderInfo[0].cityId,
          date: orderInfo[0].datePrefered.split("T")[0],
          time: orderInfo[0].datePrefered.split("T")[1],
          serviceId: orderInfo[0].serviceId,
          handyManId: orderInfo[0].handyManId,
          orderStepId: orderInfo[0].orderStepId,
          orderDetails: orderInfo[0].orderDetails,
          customerId: orderInfo[0].customerId,
          employeeId: orderInfo[0].employeeId,
          lodintable: false,
        });
        console.log(orderInfo);
        axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/Customer/GetCustomer/" +
              orderInfo[0].customerId
          )
          .then((res) => {
            // console.log(res.data.data);
            this.setState({
              fullName: res.data.data.fullName,
            });
          });

        axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/Employee/GetEmployee/" +
              orderInfo[0].employeeId
          )
          .then((res) => {
            console.log(res);
            this.setState({
              empfullName: res.data.data.fullName,
            });
          });

        axios
          .get("http://sal7lyy-001-site1.gtempurl.com/api/City/GetAllCities")
          .then((res) => {
            if (res.status === 200) {
              this.setState({
                cities: res.data.data,
              });
            }
          });

        axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/MainService/GetAllMainService"
          )
          .then((res) => {
            this.setState({
              services: res.data.data,
            });
          });

        axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/HandyMan/GetAllHandyMen"
          )
          .then((res) => {
            this.setState({
              allHandyman: res.data.data,
            });
          });

        axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/OrderStep/GetAllOrderSteps"
          )
          .then((res) => {
            this.setState({
              allSteps: res.data.data,
            });
          });
      });
  }

  render() {
    const {
      cityId,
      fullName,
      empfullName,
      date,
      time,
      cities,
      services,
      serviceId,
      handyManId,
      allHandyman,
      allSteps,
      orderStepId,
      orderDetails,
    } = this.state;
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const submitForm = (e) => {
      e.preventDefault();
      this.setState({
        loading: true,
      });
      const state = { ...this.state };
      delete state.loading;
      delete state.lodintable;
      delete state.allHandyman;
      delete state.allSteps;
      delete state.cities;
      delete state.empfullName;
      delete state.fullName;
      delete state.services;
      delete state.time;
      delete state.date;

      // state.
      let newDate = this.state.date + "T" + this.state.time + "Z";
      state.datePrefered = newDate;
      state.offerId="368e49fa-f934-4aed-14a6-08d968be4776";
      console.log(state);
      const orderId = this.props.match.params.id;
      axios
        .post(
          "http://sal7lyy-001-site1.gtempurl.com/api/Orders/UpdateOrder/" +
            orderId,
          state
        )
        .then((res) => {
          // console.log(res);
          if(res.status === 200){
            toast.success("تم التعديل بنجاح");
            this.setState({
              loading: false,
            });
            this.props.history.replace("/fixes-orders");
          }
        });
    };

    return (
      <div>
        <div className="main-content">
          <div className="dashboard-header">
            <h5>تعديل الطلب</h5>
          </div>
          <div className="new-order">
            <div className="cardForm">
              <div
                className={
                  this.state.lodintable ? "seeloading" : "seelodingdnone"
                }
              >
                <div className="spinner-grow text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <div>يتم التحميل</div>
              </div>
              <form action="" onSubmit={submitForm}>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label className="" htmlFor="user-name">
                        اسم العميل
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="user-name"
                        className="form-control"
                        onChange={handelChange}
                        value={fullName}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="employee-name" className="">
                        اسم الموظف
                      </label>
                      <input
                        type="text"
                        name="empfullName"
                        id="employee-name"
                        className="form-control"
                        onChange={handelChange}
                        value={empfullName}
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="order-date">التاريخ</label>
                      <input
                        type="date"
                        name="date"
                        id="order-date"
                        className="form-control"
                        value={date}
                        onChange={handelChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="order-time">الوقت</label>
                      <input
                        type="time"
                        name="time"
                        id="order-time"
                        className="form-control"
                        value={time}
                        onChange={handelChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="your-city">المدينة</label>
                      <select
                        className="form-control"
                        name="cityId"
                        value={cityId}
                        onChange={handelChange}
                        id="your-city"
                        readOnly={true}
                        disabled={true}
                      >
                        <option value="" selected disabled>
                          اختار المدينة
                        </option>
                        {cities.map((city) => (
                          <option value={city.id}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="order-type">نوع الخدمة</label>
                      <select
                        className="form-control"
                        name="serviceId"
                        value={serviceId}
                        onChange={handelChange}
                        id="order-type"
                      >
                        <option value="" selected disabled>
                          اختار نوع الخدمة
                        </option>
                        {services.map((serv) => (
                          <option value={serv.id}>{serv.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="order-handyman">الفني</label>
                      <select
                        name="handyManId"
                        className="form-control"
                        id="order-handyman"
                        onChange={handelChange}
                        value={handyManId}
                      >
                        <option value="" selected disabled>
                          اختار الفني
                        </option>
                        {allHandyman.map((handyman) => (
                          <option value={handyman.id}>
                            {handyman.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <div className="form-group">
                      <label htmlFor="order-status">حالة الطلب</label>
                      <select
                        name="orderStepId"
                        id="order-status"
                        className="form-control"
                        value={orderStepId}
                        onChange={handelChange}
                      >
                        <option value="" selected disabled>
                          حالة الاوردر
                        </option>
                        {allSteps.map((step) => (
                          <option value={step.id}>{step.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-12">
                    <div className="form-group">
                      <label htmlFor="order-detials">تفاصيل الطلب</label>
                      <textarea
                        name="orderDetails"
                        id="order-detials"
                        className="form-control"
                        value={orderDetails}
                        handelChange={handelChange}
                        id=""
                        cols="30"
                        rows="10"
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-12">
                    <div class="btn-submit">
                      <button type="submit" disabled={this.state.disabled}>
                        {this.state.loading ? (
                          <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "تعديل"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
