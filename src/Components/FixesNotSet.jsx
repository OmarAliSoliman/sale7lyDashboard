import React, { Component } from "react";

// data MDBDataTable from mdbreact
import { MDBDataTable } from "mdbreact";

// component
import TopHeader from "../Components/TopHeader";

// axios
import axios from "axios";
import { Link } from "react-router-dom";
import MdTable from "../Components/MdTable";

// mdreact
import { MDBBtn } from "mdbreact";
import ModalAddHandymanToOrder from "./ModalAddHandymanToOrder";

class FixesNotSet extends Component {
  state = {
    data: [],
    names: [],
    lodintable: true,
    rowdata: {},
  };

  handleShow = (dat) => {
    this.setState({
      show: true,
      rowdata: dat
    });
  };

  async componentDidMount() {
    await axios
      .get(
        "http://sal7lyy-001-site1.gtempurl.com/api/Orders/GetAllOrdersByStep/65061149-cbbd-4c1b-b4fa-08d976563b97"
      )
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          this.setState({
            lodintable: false,
          });
        }
        var newData = res.data.data.reverse();
        newData.map((dat, index) => {
          // dat.option = (
          //   <div className="option-parent">
          //     {/* <Link to="/" className="tableOption op-delete">
          //       <i className="fi-rr-trash"></i>
          //     </Link> */}
          //     {/* <Link to="/" className="tableOption op-order">
          //       <i className="fi-rr-apps"></i>
          //     </Link>
          //     <Link to="/" className="tableOption op-edit">
          //       <i className="fi-rr-edit"></i>
          //     </Link> */}
          //   </div>
          // );
          dat.technicals = (
            <div className="option-parent">
              <MDBBtn
                className="btnOpenModal"
                size="sm"
                onClick={()=>this.handleShow(dat)}
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
  }

  render() {
    const datatable = {
      columns: [
        { label: "العميل", field: "fullName" },
        { label: "الفني", field: "technicals" },
        { label: "الخدمة", field: "service" },
        { label: "السعر", field: "price" },
        { label: "الحاله", field: "orderstep" },
        { label: "تاريخ الطلب", field: "dateMod" },
        // { label: "الاختيارات", field: "option" },
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
    return (
      <div>
        
        <h5 class="mb-3 text-center font-weight-bold h4">لم يتم التعيين</h5>
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
          rowdata = {this.state.rowdata}
          // handelChange={handelChange}
        />
      </div>
    );
  }
}

export default FixesNotSet;
