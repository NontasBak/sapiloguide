// Initial code:
module TrafLightController (
    output wire RED, YLW, GRN,
    input wire Clock, Reset, Car, Timeout);

    parameter Red = 3'b001, Yellow = 3'b010, Green = 3'b100;

    reg [2:0] state, nextstate;

    always @(*) begin
        case (state)
            Green:  nextstate = (Car ? Yellow : Green);
            Yellow: nextstate = Red;
            Red:    nextstate = (Timeout ? Green : Red);
            default: nextstate = Green;
        endcase
    end

    always @(posedge Clock or negedge Reset) begin
        if (!Reset)
            state <= Green;
        else
            state <= nextstate;
    end

    assign {GRN, YLW, RED} = state;

endmodule

// ----------------------------------------------
// Ex2 (a)

/*
Ο κώδικας αυτός περιγράφει ένα Mealy FSM για ένα σύστημα ελέγχου φαναριών.
Το σύστημα έχει τρεις καταστάσεις: Red, Yellow, Green.
Οι καταστάσεις είναι one-hot encoded.
Η κατάσταση αλλάζει ανάλογα με τις εισόδους Car και Timeout.

Όταν το φανάρι είναι πράσινο, αν υπάρχει αυτοκίνητο στον κάθετο δρόμο (Car = 1),
δηλαδή στον δρόμο που είναι κάθετος στο δρόμο του φαναριού,
τότε αλλάζει σε κίτρινο. Αν δεν υπάρχει αυτοκίνητο, παραμένει πράσινο.

Όταν το φανάρι είναι κόκκινο, αν έχει τελειώσει ο timer (Timeout = 1),
τότε αλλάζει σε πράσινο. Αν δεν έχει τελειώσει, παραμένει κόκκινο.

Το reset είναι ασύγχρονο active low.
*/

// ----------------------------------------------
// Ex2 (b)

module TrafLightController_modified (
    output logic RED, YLW, GRN,
    input logic Clock, Reset, Car, Timeout
);

    enum logic [2:0] {
        Red = 3'b001, Yellow = 3'b010, Green = 3'b100
    } state, nextstate;

    /*
    Εναλλακτικά:

    typedef enum logic [2:0] {
        Red = 3'b001, Yellow = 3'b010, Green = 3'b100
    } state_t;

    state_t state, nextstate;
    */

    always_comb begin
        unique case (state)
            Green:  nextstate = (Car ? Yellow : Green);
            Yellow: nextstate = Red;
            Red:    nextstate = (Timeout ? Green : Red);
            default: nextstate = Green;
        endcase
    end

    always_ff @(posedge Clock or negedge Reset) begin
        if (!Reset)
            state <= Green;
        else
            state <= nextstate;
    end

    assign {GRN, YLW, RED} = state;

endmodule