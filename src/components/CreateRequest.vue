<template>
  <section>
    <h2>Ny bestilling</h2>
    <AddressInput />
    <BigTextInput
      labelText="Ankomstbeskrivelse"
      placeholderText="F.eks: I smuget bak rammeverkstedet"
      @change="updateArrivalDescription"
      :existing="arrivalDesc"
    />
    <NumberInput
      labelText="Telefonummer (uten landskode)"
      placeholderText="98765432"
      @emitNumberInput="updatePhoneNumber"
      :existing="phoneNr"
    />
    <label for="payment-solution">Betalingsmetode</label>
    <v-select
      id="payment-solution"
      name="payment-solution"
      :options="['Vipps', 'Kontant', 'Bankoverføring']"
      :value="paymentSolution"
      @input="updatePaymentSolution"
    />
    <Items
      v-if="this.items.length >= 1"
      @updateItem="addItem"
      :nrOfItems="items"
      @addItem="addItem"
      @deleteItem="deleteItem"
      @decrementCount="decrementItemCount"
      @incrementCount="incrementItemCount"
      @updateName="updateItemName"
    />
    <Button
      btnText="Ny vare"
      :btnDisabled="false"
      @btnClicked="renderNewItem"
    />
    <p class="error" v-if="errorMsg">Du må legge til alle varene!</p>
    <p class="error" v-if="addressError">Du må legge til en adresse!</p>
    <p class="error" v-if="zeroItemsError">Du må legge til minst en vare!</p>
    <p class="error" v-if="phoneNumberError">
      Du må legge til en Telefonummer!
    </p>
    <p class="error" v-if="itemNameError">Varen må ha et navn!</p>
    <p class="error" v-if="paymentSolutionError">
      Du må legge til en betalingsløsing!
    </p>
    <div>
      <hr />
      <Button
        btnText="Gå til oppsummering"
        :btnDisabled="false"
        @btnClicked="toSummary"
      />
    </div>
  </section>
</template>

<script>
import Button from "@/components/shared/Button.vue";
import BigTextInput from "@/components/shared/BigTextInput.vue";
import NumberInput from "@/components/shared/NumberInput.vue";
import Items from "@/components/shared/Items.vue";
import AddressInput from "@/components/AddressInput.vue";

export default {
  name: "CreateRequest",
  components: {
    Items,
    Button,
    BigTextInput,
    NumberInput,
    AddressInput
  },
  data() {
    return {
      items: [],
      errorMsg: false,
      addressError: false,
      phoneNumberError: false,
      zeroItemsError: false,
      itemNameError: false,
      paymentSolutionError: false,
      address: "",
      phoneNr: "",
      arrivalDesc: "",
      paymentSolution: ""
    };
  },
  methods: {
    updateAddress(event) {
      const { value } = event.target;
      this.addressError = false;
      this.address = value;
    },
    updatePhoneNumber(event) {
      const { value } = event.target;
      this.phoneNumberError = false;
      this.phoneNr = value.replace(/\+47/g, "").replace(/ /g, "");
    },
    updateArrivalDescription(value) {
      this.arrivalDesc = value;
    },
    updatePaymentSolution(value) {
      this.paymentSolutionError = false;
      this.paymentSolution = value;
    },
    deleteItem(index) {
      this.items.splice(index, 1);
      this.$store.dispatch("SET_ITEMS", this.items);
      this.errorMsg = false;
    },
    addItem(index) {
      if (this.items[index].itemName.length > 0) {
        this.items[index].added = true;
        this.$store.dispatch("SET_ITEMS", this.items);
        this.errorMsg = false;
      } else {
        this.itemNameError = true;
      }
    },
    renderNewItem() {
      this.items.push({
        itemName: "",
        count: 1,
        added: false
      });
      this.errorMsg = false;
      this.zeroItemsError = false;
    },
    updateItemName(input, index) {
      this.itemNameError = false;
      this.items[index].itemName = input;
    },
    incrementItemCount(index) {
      this.items[index].count += 1;
    },
    decrementItemCount(index) {
      if (this.items[index].count > 1) {
        this.items[index].count -= 1;
      }
    },
    toSummary() {
      const itemsMapped = this.items.map(item => item.added);
      if (!this.paymentSolution) {
        this.paymentSolutionError = true;
        return;
      }
      if (itemsMapped.length > 0 && itemsMapped.every(Boolean)) {
        const localAddress = this.getAddress;
        if (
          localAddress.place_name_no !== undefined &&
          localAddress.place_name_no.length > 1
        ) {
          this.$store.dispatch("SET_PHONE_NUMBER_INPUT", this.phoneNr);
          this.$store.dispatch("SET_ARRIVAL_DESCRIPTION", this.arrivalDesc);
          this.$store.dispatch("SET_PAYMENT_SOLUTION", this.paymentSolution);
          this.$emit("toSummary");
        } else {
          this.addressError = true;
        }
      } else if (!itemsMapped.every(Boolean)) {
        this.errorMsg = true;
      } else {
        this.zeroItemsError = true;
      }
    }
  },
  computed: {
    getArrivalDescription() {
      return this.$store.getters.arrivalDescription;
    },
    getAddress() {
      return this.$store.getters.address;
    },
    getItems() {
      return this.$store.getters.items;
    },
    getPhoneNumber() {
      return this.$store.getters.phoneNumberInput;
    },
    getPaymentSolution() {
      return this.$store.getters.paymentSolution;
    }
  },
  mounted() {
    this.items = this.getItems;
    this.address = this.getAddress;
    this.phoneNr = this.$store.getters.phoneNumber || this.phoneNr;
    this.arrivalDesc = this.getArrivalDescription;
    this.paymentSolution = this.getPaymentSolution;
  }
};
</script>

<style lang="scss" scoped>
section > * + * {
  margin-top: 1rem;
}

.error {
  text-align: center;
  color: $color-danger;
}
</style>
