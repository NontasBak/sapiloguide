// Ex1 (a)

/*
Θέλουμε να αναπαραστήσουμε συνολικά 4096 + 1 = 4097 διαφορετικές τιμές.
Οπότε log_2(4097) = 13 bits (αν κάνουμε round up).

Έχουμε 2^12 = 4096, άρα το pow θα έχει log_2(12) = 4 bits
(αν κάνουμε round up)

Συνολικά έχουμε:
- Είδοσος pow: 4 bits
- Έξοδος result: 13 bits
*/

// ----------------------------------------------
// Ex1 (b)

module power_of_2_calculator (
    input  logic clk,
    input  logic clr,
    input  logic [3:0] pow,
    output logic [12:0] result
);

    typedef enum logic [1:0] {
        S_IDLE, // Reset state, output is 1
        S_COMPUTE,
        S_HOLD
    } state_t;

    state_t state, next_state;

    always_ff @(posedge clk) begin
        if (clr) begin
            state <= S_IDLE;
        end else begin
            state <= next_state;
        end
    end

    // Next state logic
    always_comb begin
        case (state)
            S_IDLE: begin
                next_state = S_COMPUTE;
            end
            S_COMPUTE: begin
                next_state = S_HOLD;
            end
            S_HOLD: begin
                next_state = S_HOLD;
                // Stay in HOLD state until clr == 1
            end
            default: begin
                next_state = S_HOLD;
            end
        endcase
    end

    // Output logic
    always_ff @(posedge clk) begin
        if (clr) begin
            result <= 1;
        end else begin
            if (state == S_COMPUTE) begin
                if (pow <= 12) begin
                    result <= (1 << pow);
                end
                // If pow > 12, we don't change result
            end
        end
    end

endmodule