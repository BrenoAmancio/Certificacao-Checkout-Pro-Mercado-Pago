const publicKey = "APP_USR-615d9b41-d20b-486d-83c2-aa826f50cb50";
// preferenceId = null;
const state = new Proxy(
  { preferenceId: null },
  {
    set(target, prop, value) {
      target[prop] = value;

      if (prop === 'preferenceId' && value !== undefined) {
        renderWalletBrick(bricksBuilder);
      }
    }
  }
)


const mercadopago = new MercadoPago('APP_USR-615d9b41-d20b-486d-83c2-aa826f50cb50', { locale: 'pt-BR' });

// const btnCheck = document.getElementById("checkout");
// const btnQuant = document.getElementById("quantity");
  
document.addEventListener("DOMContentLoaded", async ()=> {
  
  await fetch("https://certificacao-checkout-pro-mercado-pago.onrender.com/create-preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(dadosPagamento),
  })
  .then((response) => {
    console.log(response);
    // preferenceId = response.preferenceId;
    
    return response.json();
  })
  .then((responseJSON) => {
    state.preferenceId = responseJSON.preferenceId;
    console.log(state.preferenceId);
  })
  .catch((err) => {
    alert(`Ocorreu um erro inesperado!, ${err}`);
  });
});

const bricksBuilder = mercadopago.bricks();
const renderWalletBrick = async (bricksBuilder) => {
  await bricksBuilder.create('wallet', 'walletBrick_container', {
    initialization: {
      preferenceId: state.preferenceId
    }
  })
}




// if (preferenceId !== null) {
//   renderWalletBrick(bricksBuilder);
// }

