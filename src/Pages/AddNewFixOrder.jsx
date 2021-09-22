import React, { Component } from "react";

// component
import TopHeader from "../Components/TopHeader";

// axios
import axios from "axios";

// joi
import joi from "joi-browser";

//
import { toast } from "react-toastify";

//
import { Link } from "react-router-dom";

class AddNewFixOrder extends Component {
  state = {
    cities: [],
    services: [],
    emplyees: [],
    date: "",
    time: "",
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    cityId: "",
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
    errors: {},
    loading: false,
    disabled: false,
    lodintable: false,
    disableBtn: false,
  };

  schema = {
    fullName: joi.string().required(),
    mobile: joi.string().alphanum().min(11).max(11).required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    cityId: joi.string().required(),
    employeeId: joi.string().required(),
    serviceId: joi.string().required(),
    date: joi.date().required(),
    time: joi.string().required(),
    orderDetails: joi.string().required(),
  };

  validate = () => {
    var state = { ...this.state };
    delete state.cities;
    delete state.services;
    delete state.emplyees;
    delete state.handyManId;
    delete state.datePrefered;
    delete state.orderStepId;
    delete state.offerId;
    delete state.orderComments;
    delete state.orderNotes;
    delete state.price;
    delete state.offerPrice;
    delete state.priceAfterOffer;
    delete state.customerId;
    delete state.errors;
    delete state.loading;
    delete state.disabled;
    delete state.lodintable;
    delete state.disableBtn;
    const res = joi.validate(state, this.schema, { abortEarly: false });
    console.log(res);
    if (res.error === null) {
      this.setState({
        errors: {},
      });
      return res.error;
    }

    let newErrors = {};
    res.error.details.map((er) => {
      newErrors[er.path] = er.message;
    });

    this.setState({
      errors: newErrors,
    });

    return res.error;
  };

  componentDidMount() {
    axios
      .get("http://sal7lyy-001-site1.gtempurl.com/api/City/GetAllCities")
      .then((res) => {
        this.setState({
          cities: res.data.data,
        });
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
      .get("http://sal7lyy-001-site1.gtempurl.com/api/Employee/GetAllEmployee")
      .then((res) => {
        this.setState({
          emplyees: res.data.data,
        });
      });

    axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/OrderStep/GetAllOrderSteps"
      )
      .then((res) => {
        // console.log(res.data.data[0].name);
        this.setState({
          orderStepId: res.data.data[0].id,
        });
      });
  }

  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const submitForm = async (e) => {
      e.preventDefault();
      this.setState({
        lodintable: true,
      });
      const errors = this.validate();

      this.setState({
        loading: true,
        disabled: true,
      });
      if (errors === null) {
        var customerInfo = {};
        var customermobile = this.state.mobile;
        try {
          await axios
            .get(
              "http://sal7lyy-001-site1.gtempurl.com/api/Customer/GetAllCustomer"
            )
            .then((res) => {
              customerInfo = res.data.data.filter(
                (cu) => cu.mobile === customermobile
              );
              if (customerInfo.length === 0) {
                toast.error("You Are New Customer Please Sign Up First");
                // this.props.history.replace("/add-new-customer");
              } else {
                let state = { ...this.state };
                delete state.cities;
                delete state.services;
                delete state.emplyees;
                delete state.date;
                delete state.time;
                delete state.fullName;
                delete state.mobile;
                delete state.email;
                delete state.address;
                // delete state.employeeId;
                delete state.handyManId;
                // delete state.orderStepId;
                delete state.offerId;
                delete state.errors;
                delete state.loading;
                delete state.disabled;
                delete state.lodintable;
                delete state.disableBtn;

                let newDate = this.state.date + "T" + this.state.time + "Z";
                state.datePrefered = newDate;
                state.customerId = customerInfo[0].id;
                console.log(state);

                axios
                  .post(
                    "http://sal7lyy-001-site1.gtempurl.com/api/Orders/CreateOrder",
                    state
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      this.setState({
                        lodintable: false,
                        disableBtn: false
                      });
                      // console.log(res);
                      toast.success("تم تسجيل الطلب بنجاح");
                      this.setState({
                        loading: false,
                        disabled: false,
                        fullName: "",
                        mobile: "",
                        address: "",
                        email: "",
                        cityId: "",
                        employeeId: "",
                        date: "",
                        time: "",
                        orderDetails: "",
                      });
                    }
                  });
              }
            });
        } catch (ex) {
          toast.error("برجاء التاكد من المعلومات");
          this.setState({
            lodintable: false,
          });
          return;
        }
      } else {
        toast.error("برجاء التاكد من المعلومات");
        this.setState({
          loading: false,
          disabled: false,
          lodintable: false
        });
        return;
      }
    };

    const customerVerfication = async (e) => {
      e.preventDefault();
      this.setState({
        lodintable: true,
      });
      var customerInfo = {};
      var customermobile = this.state.mobile;
      console.log(customermobile);
      try {
        await axios
          .get(
            "http://sal7lyy-001-site1.gtempurl.com/api/Customer/GetAllCustomer"
          )
          .then((res) => {
            if (res.status === 200) {
              this.setState({
                lodintable: false,
                disableBtn: true
              });
            }
            customerInfo = res.data.data.filter(
              (cu) => cu.mobile === customermobile
            );
            console.log(customerInfo);
            this.setState({
              fullName: customerInfo[0].fullName,
              address: customerInfo[0].address,
              mobile: customerInfo[0].mobile,
              email: customerInfo[0].email,
              cityId: customerInfo[0].cityId,
              customerId: customerInfo[0].id,
              errors: {},
            });
          });
      } catch (ex) {
        toast.info("لا يوجد عميل مسجل برجاء تسجيل كعميل جديد");
        this.setState({
          fullName: "",
          address: "",
          mobile: "",
          email: "",
          cityId: "",
        });
      }
    };

    const { cities, services, emplyees } = this.state;

    return (
      <div>
        <div className="main-content">
          <div className="dashboard-header">
            <h5>عمل طلب صيانه</h5>
          </div>

          <div class="addNewFix-Parent">
            <div class="add-new-fix">
              <div
                className={
                  this.state.lodintable ? "seeloading" : "seelodingdnone"
                }
              >
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div>يتم التحميل</div>
              </div>
              <form action="" onSubmit={submitForm}>
                <div className="customer-verification">
                  <p className="fnote">
                    اذا كنت عميل قديم فقم بكتابة رقم الهاتف واضغط على بحث او قم
                    بعمل حساب جديد من خلال الضغط على عميل جديد
                  </p>
                  <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-8">
                      <div className="form-group">
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="ادخل رقم الهاتف واضغط على بحث"
                            name="mobile"
                            onChange={handelChange}
                            value={this.state.mobile}
                          />
                          <div className="input-group-append">
                            <button
                              onClick={customerVerfication}
                              className="input-group-text"
                            >
                              <span>بحث</span>
                            </button>
                          </div>
                        </div>
                        <span className="error">
                          {this.state.errors.mobile}
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                      <div className="form-group">
                        <Link
                          to="/add-new-customer"
                          className="btn btn-new-customer"
                        >
                          عميل جديد
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        id=""
                        className="form-control"
                        placeholder="اسم العميل"
                        value={this.state.fullName}
                        onChange={handelChange}
                        disabled = {this.state.disableBtn ? true:false}
                      />
                      <span className="error">
                        {this.state.errors.fullName}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        type="number"
                        name="mobile"
                        id=""
                        className="form-control"
                        placeholder="رقم التلفون"
                        value={this.state.mobile}
                        onChange={handelChange}
                        disabled = {this.state.disableBtn ? true:false}
                      />
                      <span className="error">{this.state.errors.mobile}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        type="text"
                        name="address"
                        id=""
                        className="form-control"
                        placeholder="العنوان"
                        value={this.state.address}
                        onChange={handelChange}
                        disabled = {this.state.disableBtn ? true:false}
                      />
                      <span className="error">{this.state.errors.address}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        id=""
                        className="form-control"
                        placeholder="الايميل"
                        value={this.state.email}
                        onChange={handelChange}
                        disabled = {this.state.disableBtn ? true:false}
                      />
                      <span className="error">{this.state.errors.email}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <select
                        name="cityId"
                        id=""
                        value={this.state.cityId}
                        className="customSelect form-control"
                        onChange={handelChange}
                        disabled = {this.state.disableBtn ? true:false}
                      >
                        <option value="" selected disabled>
                          المحافظة
                        </option>
                        {cities.map((city) => (
                          <option value={city.id}>{city.name}</option>
                        ))}
                      </select>
                      <span className="error">{this.state.errors.cityId}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <select
                        name="employeeId"
                        id=""
                        className="customSelect form-control"
                        value={this.state.employeeId}
                        onChange={handelChange}
                      >
                        <option value="" selected disabled>
                          تسجيل
                        </option>
                        {emplyees.map((em) => (
                          <option value={em.id}>{em.fullName}</option>
                        ))}
                      </select>
                      <span className="error">
                        {this.state.errors.employeeId}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <select
                        name="serviceId"
                        id=""
                        className="customSelect form-control"
                        value={this.state.serviceId}
                        onChange={handelChange}
                      >
                        <option value="" selected disabled>
                          نوع الخدمة{" "}
                        </option>
                        {services.map((serv) => (
                          <option value={serv.id}>{serv.name}</option>
                        ))}
                      </select>
                      <span className="error">
                        {this.state.errors.serviceId}
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        type="date"
                        name="date"
                        id=""
                        className="form-control"
                        placeholder="التاريخ"
                        value={this.state.date}
                        onChange={handelChange}
                      />
                      <span className="error">{this.state.errors.date}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        placeholder="الموعد المتاح للطلب"
                        name="time"
                        type="time"
                        value={this.state.time}
                        onChange={handelChange}
                      />
                      <span className="error">{this.state.errors.time}</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-12">
                    <div className="form-group">
                      <textarea
                        name="orderDetails"
                        className="form-control"
                        id=""
                        placeholder="وصف الخدمه"
                        value={this.state.orderDetails}
                        onChange={handelChange}
                      ></textarea>
                      <span className="error">
                        {this.state.errors.orderDetails}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="btn-submit">
                  <button type="submit" disabled={this.state.disabled}>
                    {this.state.loading ? (
                      <div class="spinner-border text-light" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "تسجيل"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddNewFixOrder;
