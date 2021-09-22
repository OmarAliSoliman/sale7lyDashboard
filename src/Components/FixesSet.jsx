import React, { Component } from "react";

// data MDBDataTable from mdbreact
import { MDBDataTable } from "mdbreact";

// component
import TopHeader from "../Components/TopHeader";

// axios
import axios from "axios";
import { Link } from "react-router-dom";
import MdTable from "../Components/MdTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// mdreact
import { MDBBtn } from "mdbreact";
import ModalAddHandymanToOrder from "./ModalAddHandymanToOrder";
// import FixesNotSet from "../Components/FixesNotSet";

class FixesSet extends Component {
  state = {
    data: [],
    names: [],
    lodintable: true,
  };

  handleShow = () => {
    this.setState({
      show: true,
    });
  };

  async componentDidMount() {
    // console.log("hi");
    // var name= {};
    await axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/Orders/GetAllOrdersByStep/6e0d1ff9-b2f5-4a29-b4fb-08d976563b97"
      )
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.setState({
            lodintable: false,
          });
        }
        var newData = res.data.data;
        newData.map((dat, index) => {
          dat.option = (
            <div className="option-parent">
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled" className="tooltipcalss">
                    انهاء الطلب
                  </Tooltip>
                }
              >
                <button
                  onClick={() => this.finishOrder(dat)}
                  className="tableOption op-delete"
                >
                  <i className="fi-rr-checkbox"></i>
                </button>
              </OverlayTrigger>

              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled" className="tooltipcalss">
                    تعديل الطلب
                  </Tooltip>
                }
              >
                <Link
                  to={"/edit-order-info/" + dat.id}
                  className="tableOption op-edit"
                >
                  <i className="fi-rr-edit"></i>
                </Link>
              </OverlayTrigger>
            </div>
          );
          dat.technicals = (
            <div className="option-parent">
              <MDBBtn
                className="btnOpenModal"
                size="sm"
                onClick={this.handleShow}
              >
                <i className="fi-rr-pencil"></i>
                <span>اضف فني</span>
              </MDBBtn>
            </div>
          );
          var dataDate = dat.dateCreated.split("T")[0];
          dat.dateMod = dataDate;
        });
        this.setState({
          data: newData,
        });
      });

    axios
      .get("http://sal7lyy-001-site1.gtempurl.com/api/Customer/GetAllCustomer")
      .then((res) => {
        var newDa = this.state.data;
        newDa.map((da) => {
          const names = res.data.data.filter((dat) => dat.id === da.customerId);
          if (names.length > 0) {
            da.names = names[0].name;
          }
          da.fullName = names[0].fullName;
        });
        this.setState({
          data: newDa,
        });
      });

    axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/MainService/GetAllMainService"
      )
      .then((res) => {
        var newDa = this.state.data;
        newDa.map((da) => {
          const service = res.data.data.filter(
            (dat) => dat.id === da.serviceId
          );
          // console.log(service);
          if (service.length > 0) {
            da.service = service[0].name;
          }
        });
        this.setState({
          data: newDa,
        });
      });

    axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/OrderStep/GetAllOrderSteps"
      )
      .then((res) => {
        var newDa = this.state.data;
        newDa.map((da) => {
          const orderStep = res.data.data.filter(
            (dat) => dat.id === da.orderStepId
          );
          // console.log(orderStep);
          if (orderStep.length > 0) da.orderstep = orderStep[0].name;
        });
        this.setState({
          data: newDa,
        });
      });

    axios
      .get("http://sal7lyy-001-site1.gtempurl.com/api/HandyMan/GetAllHandyMen")
      .then((res) => {
        var newDa = this.state.data;
        newDa.map((da) => {
          const handymen = res.data.data.filter(
            (dat) => dat.id === da.handyManId
          );
          // console.log(handymen);
          if (handymen.length > 0) da.handymen = handymen[0].fullName;
        });
        this.setState({
          data: newDa,
        });
      });
  }

  finishOrder = (dat) => {
    console.log(dat.orderStepId);
    dat.orderStepId = "75a5b650-33ea-4f81-b4fc-08d976563b97";
    axios
      .post(
        "http://sal7lyy-001-site1.gtempurl.com/api/Orders/UpdateOrder/" +
          dat.id,
        dat
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
        console.log(res.data.data);
      });
  };

  render() {
    const datatable = {
      columns: [
        { label: "العميل", field: "fullName" },
        { label: "الفني", field: "handymen" },
        { label: "الخدمة", field: "service" },
        { label: "السعر", field: "price" },
        { label: "الحاله", field: "orderstep" },
        { label: "تاريخ الطلب", field: "dateMod" },
        { label: "الاختيارات", field: "option" },
      ],
      rows: this.state.data,
    };

    const handleClose = () => {
      this.setState({
        show: false,
      });
    };

    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const submitForm = (e) => {
      e.preventDefault();
    };

    return (
      <div>
        <h5 class="mb-3 text-center font-weight-bold h4">تم التعيين</h5>

        <div
          className={this.state.lodintable ? "seeloading" : "seelodingdnone"}
        >
          <div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div>يتم التحميل</div>
        </div>
        <MdTable datatable={datatable} />

        <ModalAddHandymanToOrder
          show={this.state.show}
          handleShow={this.handleShow}
          handleClose={handleClose}
          submitForm={submitForm}
        />
      </div>
    );
  }
}

export default FixesSet;

{
  /* <div
className={
  this.state.lodintable ? "seeloading" : "seelodingdnone"
}
>
<div class="spinner-grow text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div>يتم التحميل</div>
</div> */
}
