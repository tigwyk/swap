import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import * as nanocurrency from 'nanocurrency';
import { getSendURI } from 'banano-uri-generator';
import { banToRaw } from 'banano-unit-converter';

class BananoButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: true,
      showQR: false,
    };
    if (typeof window !== 'undefined') {
      window.React = React;
      window.ReactDOM = ReactDOM;
    }
  }

  componentDidMount() {
    const {
      isScriptLoaded,
      isScriptLoadSucceed
    } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true, showQR: false });
    }
  }
  componentDidUpdate(nextProps) {
    const {
      isScriptLoaded,
      isScriptLoadSucceed,
    } = nextProps;

    const isLoadedButWasntLoadedBefore =
      !this.state.showButton &&
      !this.props.isScriptLoaded &&
      isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true, showQR: false });
      }
    }
  }
  /*
  componentWillReceiveProps(nextProps) {
    const {
      isScriptLoaded,
      isScriptLoadSucceed,
    } = nextProps;

    const isLoadedButWasntLoadedBefore =
      !this.state.showButton &&
      !this.props.isScriptLoaded &&
      isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true, showQR: false });
      }
    }
  }
*/
  render() {
    const {
      data
    } = this.props;
    //console.log(this.props);
    const styles = {
      color: data.qrFg,
      marginLeft: 8
    }

    const {
      showButton,
      showQR,
    } = this.state;

    const onPayment = () => {
      if(nanocurrency.checkAddress(this.state.nano_address)) {
        this.setState({ showButton: false, showQR: true });
        this.props.submitAddress(this.state.nano_address);
      }
    }

    const amount = data.amount ? banToRaw(data.amount) : '',
          label = data.label ? data.label : '',
          bananoURI = getSendURI(data.address, amount, label);

    const handleChange = (e) => {
      //console.log(e.target.coin_address_block.value);
      if(nanocurrency.checkAddress(e.target.value))
        this.setState({nano_address: e.target.value});
    };
    return (

      <div className="input-group">
        {showButton && <input className="form-control" type="text" name="coin_address_block" placeholder="nano_" autoComplete="on" pattern="^[nano]_[13][0-13-9a-km-uw-z]{59}$" size="75" required onChange={handleChange}/>}
        {showButton && <button onClick={onPayment} type="submit" className="btn btn-primary" name="banano_button">
          {data.title ? data.title : 'Pay with BAN'}
          </button>}
            {showQR && <QRCode
                      value={bananoURI}
                      size={data.qrSize ? parseInt(data.qrSize, 10) : 128}
                      level={data.qrLevel ? data.qrLevel : 'M'}
                      fgColor={data.qrFg}
                      bgColor={data.qrBg}
                      includeMargin={true}
                />}
            {showQR && data.info && <div style={ styles }>
              <div><small>Address: {data.address}</small></div>
              <div><small>Amount: Between 0.2 and 1 BANANO</small></div>
              <div>Instructions: Send amount to BANANO address and receive exchanged currency to supplied address.</div>
            </div>}
      </div>
    );
  }
}

// maybe QR generator here...
export default BananoButton;