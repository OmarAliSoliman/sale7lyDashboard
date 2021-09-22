import React, { Component } from "react";

// modal
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";

class ModalFormEditJopTitle extends Component {
  state = {
    handymanMobile: "",
    handymanNameChosen: "لم يتم اختيار فني",
    handymanId: "",
    loading: false,
    loadingbtn: false,
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
  };


  render() {
    const handelChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
      });
    };

    const getHandyman = (e) => {
      e.preventDefault();
      this.setState({
        loading: true,
      });
      var handymenmobile = this.state.handymanMobile;
      // console.log(this.state.handymanCardId);
      axios
        .get(
          "http://sal7lyy-001-site1.gtempurl.com/api/HandyMan/GetAllHandyMen"
        )
        .then((res) => {
          var newHandyMen = res.data.data;
          var handymen = res.data.data.filter(
            (hand) => hand.mobile == handymenmobile
          );
          if (handymen.length > 0) {
            this.setState({
              handymanNameChosen: handymen[0].fullName,
              handymanId: handymen[0].id,
              loading: false,
            });
            toast.success("تم ايجاد الفني بنجاح");
          } else {
            this.setState({
              handymanNameChosen: "لم يتم اختيار فني",
              loading: false,
            });
            toast.error("لا يوجد فني مسجل لدينا بهذا الرقم");
          }
          console.log(handymen);
        });
    };

    const submitForm = (e) => {
      e.preventDefault();
      const rowData = this.props.rowdata;
      const orderId = rowData.id;
      console.log(rowData);
      this.setState(
        {
          cityId: rowData.cityId,
          customerId: rowData.customerId,
          employeeId: rowData.employeeId,
          handyManId: rowData.handyManId,
          datePrefered: rowData.datePrefered,
          serviceId: rowData.serviceId,
          orderStepId: rowData.orderStepId,
          offerId: rowData.offerId,
          orderDetails: rowData.orderDetails,
          orderComments: rowData.orderComments,
          orderNotes: rowData.orderNotes,
          price: rowData.price,
          offerPrice: rowData.offerPrice,
          priceAfterOffer: rowData.priceAfterOffer,
        },
        () => {
          const state = { ...this.state };
          delete state.handymanMobile;
          delete state.handymanNameChosen;
          delete state.handymanId;
          delete state.loading;
          delete state.loadingbtn;
          state.orderStepId = "6e0d1ff9-b2f5-4a29-b4fb-08d976563b97";
          state.handyManId = this.state.handymanId;
          console.log(state);
          axios
            .post(
              "http://sal7lyy-001-site1.gtempurl.com/api/Orders/UpdateOrder/" +
                orderId,
              state
            )
            .then((res) => {
              if (res.status === 200) {
                toast.success("تم التعديل برجاء برجاء انتظار تنشيط الصفحة");
                window.location.reload();
              }
            });
        }
      );
    };

    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.handleClose}
          className="modalChangejopTitle"
        >
          <Modal.Header closeButton>
            <Modal.Title>اختيار الفني</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={submitForm}>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="form-group mb-2">
                    <input
                      type="text"
                      name="handymanMobile"
                      value={this.state.handymanMobile}
                      onChange={handelChange}
                      className="form-control"
                      id=""
                      placeholder="رقم الهاتف"
                      value={this.props.nameoftitle}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-12">
                  <button
                    onClick={getHandyman}
                    className="btn btn-dark mt-0 mb-2"
                  >
                    {this.state.loading ? (
                      <div class="spinner-border text-light" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "بحث"
                    )}
                  </button>
                </div>
                <div className="col-sm-12 col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      readOnly={true}
                      className="form-control"
                      value={this.state.handymanNameChosen}
                      name=""
                      id=""
                    />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-block btn-dark-green"
                variant="primary"
                type="submit"
              >
                {this.state.loadingbtn ? (
                  <div class="spinner-border text-light" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  "حفظ التغيرات"
                )}
              </button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ModalFormEditJopTitle;
