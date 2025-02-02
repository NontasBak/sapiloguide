// File: HW1_Sept23_Ex4.v
module HW1_Sept23_Ex4 (
    output Y,
    input X, clk, rst
)

    reg current_state, next_state;

    // One-hot encoding
    parameter   S0 = 4'b0001,
                S1 = 4'b0010,
                S2 = 4'b0100,
                S3 = 4'b1000;
    
    always @(posedge clk or posedge rst)
        begin
            if (rst)
                current_state <= S0;
            else
                current_state <= next_state;
        end

    always @(current_state or X)
        begin
            case (current_state)
                S0: X ? S0 : S1;
                S1: X ? S2 : S1;
                S2: X ? S2 : S3;
                S3: X ? S0 : S3;
                default: S0;
            endcase
        end

    always @(current_state)
        begin
            case (current_state)
                S0: Y = 1'b1;
                S1: Y = 1'b0;
                S2: Y = 1'b0;
                S3: Y = 1'b0;
                default: Y = 1'b0;
            endcase
        end

endmodule